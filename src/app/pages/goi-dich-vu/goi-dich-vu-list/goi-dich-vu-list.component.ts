import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GoiDichVuService } from '../../../services/goi-dich-vu.service';
import { GoiDichVuResponse, ServiceItem } from '../../../models/goi-dich-vu';
import { BaseResponse } from '../../../models/base-response';
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-goi-dich-vu-list',
  templateUrl: './goi-dich-vu-list.component.html',
  styleUrls: ['./goi-dich-vu-list.component.scss']
})
export class GoiDichVuListComponent implements OnInit {
  goiDichVus: GoiDichVuResponse[] = [];
  filteredGoiDichVus: GoiDichVuResponse[] = [];
  loading: boolean = false;
  searchValue: string = '';

  constructor(
    private goiDichVuService: GoiDichVuService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.loadGoiDichVus();
  }

  loadGoiDichVus() {
    this.loading = true;
    this.goiDichVuService.getAllGoiDichVu().subscribe({
      next: (response: BaseResponse<GoiDichVuResponse[]>) => {
        this.goiDichVus = response.data;
        this.filteredGoiDichVus = [...this.goiDichVus];
        this.loading = false;
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải danh sách gói dịch vụ');
        this.loading = false;
      }
    });
  }

  filterGoiDichVus() {
    if (!this.searchValue.trim()) {
      this.filteredGoiDichVus = [...this.goiDichVus];
    } else {
      const searchLower = this.searchValue.toLowerCase().trim();
      this.filteredGoiDichVus = this.goiDichVus.filter(goi => 
        goi.tenGoi.toLowerCase().includes(searchLower) ||
        goi.moTa.toLowerCase().includes(searchLower)
      );
    }
  }

  onSearch() {
    this.filterGoiDichVus();
  }

  clearSearch() {
    this.searchValue = '';
    this.filteredGoiDichVus = [...this.goiDichVus];
  }

  createGoiDichVu() {
    this.router.navigate(['/goi-dich-vu/create']);
  }

  viewGoiDichVu(goiDichVu: GoiDichVuResponse) {
    this.router.navigate([`/goi-dich-vu/view/${goiDichVu.id}`]);
  }

  editGoiDichVu(goiDichVu: GoiDichVuResponse) {
    this.router.navigate([`/goi-dich-vu/edit/${goiDichVu.id}`]);
  }

  deleteGoiDichVu(goiDichVu: GoiDichVuResponse) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa gói dịch vụ "${goiDichVu.tenGoi}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goiDichVuService.deleteGoiDichVu(goiDichVu.id).subscribe({
          next: (response: BaseResponse<any>) => {
            this.errorHandler.handleSuccess('Thành công', 'Xóa gói dịch vụ thành công');
            this.loadGoiDichVus();
          },
          error: (error: any) => {
            this.errorHandler.handleError(error, 'xóa gói dịch vụ');
          }
        });
      }
    });
  }

  formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '0 VNĐ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' VNĐ';
  }

  // Thêm method vào component để tạo tooltip
  getServiceTooltip(service: ServiceItem): string {
    return `${service.tenDichVu}\nGiá: ${this.formatCurrency(service.giaTien)}\nThời gian: ${service.deliveryTime} ngày\n${service.moTa}`;
  }
}