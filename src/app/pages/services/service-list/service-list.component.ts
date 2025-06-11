import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
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
  loading: boolean = false;
  searchValue: string = '';
  
  
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  currentPage: number = 1;
  Math = Math; 
  
  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.loading = true;
    
    console.log('Đang tải dữ liệu trang:', this.currentPage, 'với', this.rows, 'dịch vụ/trang');
    
    this.serviceService.getAllServices(this.searchValue, this.currentPage, this.rows).subscribe({
      next: (response: ApiResponse<ServiceResponse[]>) => {
        this.services = response.data;
        this.totalRecords = response.countItems || 0;
        this.loading = false;
        
        console.log('Đã tải trang', this.currentPage, 'với', this.services.length, 
                   'dịch vụ. Tổng số:', this.totalRecords);
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải danh sách dịch vụ');
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
    
    
    this.loadServices();
  }

  onSearch() {
    this.first = 0;
    this.currentPage = 1;
    this.loadServices();
  }

  clearSearch() {
    this.searchValue = '';
    this.first = 0;
    this.currentPage = 1;
    this.loadServices();
  }

  onPageSizeChange(event: any) {
    this.rows = event.value;
    this.first = 0;
    this.currentPage = 1;
    this.loadServices();
  }
  
  createService() {
    this.router.navigate(['/services/create']);
  }

  viewService(service: ServiceResponse) {
    this.router.navigate([`/services/view/${service.id}`]);
  }

  editService(service: ServiceResponse) {
    this.router.navigate([`/services/edit/${service.id}`]);
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
    return value.toLocaleString('vi-VN') + ' VNĐ';
  }

  formatDuration(days: number): string {
    return days + ' ngày';
  }

  getStatusSeverity(isActive: boolean): string {
    return isActive ? 'success' : 'danger';
  }

  getStatusLabel(isActive: boolean): string {
    return isActive ? 'Hoạt động' : 'Ngưng hoạt động';
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const utcDate = new Date(date.getTime() + 7 * 60 * 60 * 1000); 
    
    return `${utcDate.getUTCDate().toString().padStart(2, '0')}/${
      (utcDate.getUTCMonth() + 1).toString().padStart(2, '0')}/${
      utcDate.getUTCFullYear()} ${
      utcDate.getUTCHours().toString().padStart(2, '0')}:${
      utcDate.getUTCMinutes().toString().padStart(2, '0')}:${
      utcDate.getUTCSeconds().toString().padStart(2, '0')}`;
  }

  
  goToPage(page: number): void {
    if (page < 1 || page > this.getTotalPages()) return;
    
    console.log('Chuyển đến trang:', page);
    this.currentPage = page;
    this.first = (page - 1) * this.rows;
    this.loadServices();
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
}