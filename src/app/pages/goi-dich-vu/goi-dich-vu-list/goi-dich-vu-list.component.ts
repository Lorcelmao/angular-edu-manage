import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GoiDichVuService } from '../../../services/goi-dich-vu.service';
import { GoiDichVuResponse, ServiceItem } from '../../../models/goi-dich-vu';
import { ApiResponse, BaseResponse } from '../../../models/base-response';
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-goi-dich-vu-list',
  templateUrl: './goi-dich-vu-list.component.html',
  styleUrls: ['./goi-dich-vu-list.component.scss']
})
export class GoiDichVuListComponent implements OnInit {
  goiDichVus: GoiDichVuResponse[] = [];
  filteredGoiDichVus: GoiDichVuResponse[] = []; // Nếu bạn đang sử dụng cục bộ
  loading: boolean = false;
  searchValue: string = '';
  
  // Thuộc tính phân trang
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  currentPage: number = 1;
  Math = Math; // Để sử dụng Math trong template

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
    
    console.log('Đang tải dữ liệu trang:', this.currentPage, 'với', this.rows, 'gói dịch vụ/trang');
    
    this.goiDichVuService.getAllGoiDichVu(this.searchValue, this.currentPage, this.rows)
      .subscribe({
        next: (response: ApiResponse<GoiDichVuResponse[]>) => {
          this.goiDichVus = response.data;
          this.filteredGoiDichVus = response.data; // Nếu bạn đang sử dụng cục bộ
          this.totalRecords = response.countItems || 0;
          this.loading = false;
          
          console.log('Đã tải trang', this.currentPage, 'với', this.goiDichVus.length, 
                     'gói dịch vụ. Tổng số:', this.totalRecords);
        },
        error: (error: any) => {
          this.errorHandler.handleError(error, 'tải danh sách gói dịch vụ');
          this.loading = false;
        }
      });
  }

  onPageChange(event: any) {
    console.log('Page changed:', event);
    
    this.first = event.first;
    this.rows = event.rows;
    this.currentPage = Math.floor(this.first / this.rows) + 1;
    
    console.log('Current page calculated:', this.currentPage);
    this.loadGoiDichVus();
  }

  onSearch() {
    this.first = 0;
    this.currentPage = 1;
    this.loadGoiDichVus();
  }

  clearSearch() {
    this.searchValue = '';
    this.first = 0;
    this.currentPage = 1;
    this.loadGoiDichVus();
  }

  onPageSizeChange(event: any) {
    this.rows = event.value;
    this.first = 0;
    this.currentPage = 1;
    this.loadGoiDichVus();
  }

  // Phương thức phụ trợ cho phân trang tùy chỉnh
  goToPage(page: number): void {
    if (page < 1 || page > this.getTotalPages()) return;
    
    console.log('Chuyển đến trang:', page);
    this.currentPage = page;
    this.first = (page - 1) * this.rows;
    this.loadGoiDichVus();
  }
  
  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.rows) || 1;
  }
  
  getPageNumbers(): number[] {
    const totalPages = this.getTotalPages();
    const currentPage = this.currentPage;
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  // Giữ lại các phương thức hiện có
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
    // Giữ nguyên mã hiện tại
    if (value === null || value === undefined) {
      return '0 VNĐ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' VNĐ';
  }

  getServiceTooltip(service: ServiceItem): string {
    // Giữ nguyên mã hiện tại
    return `${service.tenDichVu}\nGiá: ${this.formatCurrency(service.giaTien)}\nThời gian: ${service.deliveryTime} ngày\n${service.moTa}`;
  }
}