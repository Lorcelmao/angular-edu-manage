import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ServiceService } from '../../../services/service.service';
import { ServiceResponse } from '../../../models/service';
import { ApiResponse } from '../../../models/base-response';
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  services: ServiceResponse[] = [];
  filteredServices: ServiceResponse[] = [];
  loading: boolean = false;
  searchValue: string = '';
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    this.serviceService.getAllServices().subscribe({
      next: (response: ApiResponse<ServiceResponse[]>) => {
        this.services = response.data;
        this.filteredServices = [...this.services];
        this.totalRecords = this.services.length;
        this.loading = false;
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải danh sách dịch vụ');
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (!this.searchValue.trim()) {
      this.filteredServices = [...this.services];
      this.totalRecords = this.services.length;
      return;
    }

    this.loading = true;
    this.serviceService.searchServicesByName(this.searchValue, 0, 100).subscribe({
      next: (response) => {
        this.filteredServices = response.data;
        this.totalRecords = response.countItems;
        this.loading = false;
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tìm kiếm dịch vụ');
        this.loading = false;
      }
    });
  }

  clearSearch() {
    this.searchValue = '';
    this.onSearch();
  }

  createService() {
    this.router.navigate(['/services/create']);
  }

  viewService(service: ServiceResponse) {
    this.router.navigate(['/services', service.id, 'view']);
  }

  editService(service: ServiceResponse) {
    this.router.navigate(['/services', service.id, 'edit']);
  }

  deleteService(service: ServiceResponse) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa dịch vụ "${service.tenDichVu}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.serviceService.deleteService(service.id).subscribe({
          next: (response) => {
            this.errorHandler.handleSuccess('Thành công', 'Xóa dịch vụ thành công');
            this.loadServices();
          },
          error: (error: any) => {
            this.errorHandler.handleError(error, 'xóa dịch vụ');
          }
        });
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  }

  formatDuration(days: number): string {
    if (!days && days !== 0) return '';
    
    if (days === 1) {
      return '1 ngày';
    }
    
    return `${days} ngày`;
  }

  getStatusSeverity(isActive: boolean): string {
    return isActive ? 'success' : 'danger';
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Hoạt động' : 'Ngưng hoạt động';
  }
}