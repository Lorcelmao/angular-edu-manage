import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DichVuService } from '../../../services/dich-vu.service';
import { ServiceRequest, ServiceResponse, ServiceUpdateRequest } from '../../../models/service';
import { ApiResponse } from '../../../models/base-response';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dich-vu-list',
  templateUrl: './dich-vu-list.component.html',
  styleUrls: ['./dich-vu-list.component.scss']
})
export class DichVuListComponent implements OnInit {
  
  services: ServiceResponse[] = [];
  loading: boolean = false;
  searchValue: string = '';
  
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  currentPage: number = 1;
  Math = Math;
  
  
  viewDialog: boolean = false;
  editDialog: boolean = false;
  selectedService: ServiceResponse | null = null;
  serviceForm: FormGroup;
  isSubmitting: boolean = false;
  
  
  private scrollPosition = 0;
  
  constructor(
    private dichVuService: DichVuService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private errorHandler: ErrorHandlerService,
    private fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      tenDichVu: ['', [Validators.required, Validators.minLength(2)]],
      moTa: ['', [Validators.required, Validators.minLength(10)]],
      giaTien: [null, [Validators.required, Validators.min(0)]],
      deliveryTime: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadServices();
    this.calculateScrollbarWidth();
  }

  
  loadServices() {
    this.loading = true;
    
    console.log('Đang tải dữ liệu trang:', this.currentPage, 'với', this.rows, 'dịch vụ/trang');
    
    this.dichVuService.getAllServices(this.searchValue, this.currentPage, this.rows).subscribe({
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

  onPageChange(event: any) {
    console.log('Page changed:', event);
    
    
    this.first = event.first;
    this.rows = event.rows;
    
    
    this.currentPage = Math.floor(this.first / this.rows) + 1;
    
    console.log('Current page calculated:', this.currentPage);
    
    
    this.loadServices();
  }

  onPageSizeChange(event: any) {
    this.rows = event.value;
    this.first = 0;
    this.currentPage = 1;
    this.loadServices();
  }
  
  
  viewService(service: ServiceResponse) {
    this.scrollPosition = window.pageYOffset;
    this.selectedService = service;
    
    
    
    setTimeout(() => {
      this.viewDialog = true;
      
      
      setTimeout(() => {
        window.scrollTo({
          top: this.scrollPosition,
          behavior: 'auto'
        });
      }, 0);
    }, 0);
  }

  editService(service: ServiceResponse) {
    this.scrollPosition = window.pageYOffset;
    this.selectedService = service;
    this.serviceForm.patchValue({
      tenDichVu: service.tenDichVu,
      moTa: service.moTa,
      giaTien: service.giaTien,
      deliveryTime: service.deliveryTime
    });
    
    setTimeout(() => {
      this.editDialog = true;
      
      setTimeout(() => {
        window.scrollTo({
          top: this.scrollPosition,
          behavior: 'auto'
        });
      }, 0);
    }, 0);
  }

  createService() {
    this.scrollPosition = window.pageYOffset;
    this.selectedService = null;
    this.serviceForm.reset();
    
    setTimeout(() => {
      this.editDialog = true;
      
      setTimeout(() => {
        window.scrollTo({
          top: this.scrollPosition,
          behavior: 'auto'
        });
      }, 0);
    }, 0);
  }

  deleteService(service: ServiceResponse) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa dịch vụ "${service.tenDichVu}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dichVuService.deleteService(service.id).subscribe({
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

  
  
  onSubmit() {
    if (this.serviceForm.invalid) {
      this.markFormGroupTouched();
      this.errorHandler.handleWarning('Cảnh báo', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.serviceForm.value;

    if (this.selectedService) {
      
      const updateRequest: ServiceUpdateRequest = {
        tenDichVu: formValue.tenDichVu,
        moTa: formValue.moTa,
        giaTien: Number(formValue.giaTien),
        deliveryTime: Number(formValue.deliveryTime)
      };
      
      this.dichVuService.updateService(this.selectedService.id, updateRequest).subscribe({
        next: (response) => {
          this.errorHandler.handleSuccess('Thành công', 'Cập nhật dịch vụ thành công');
          this.closeEditDialog();
          this.loadServices();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorHandler.handleError(error, 'cập nhật dịch vụ');
          this.isSubmitting = false;
        }
      });
    } else {
      
      const createRequest: ServiceRequest = {
        tenDichVu: formValue.tenDichVu,
        moTa: formValue.moTa,
        giaTien: Number(formValue.giaTien),
        deliveryTime: Number(formValue.deliveryTime)
      };
      
      this.dichVuService.createService(createRequest).subscribe({
        next: (response) => {
          this.errorHandler.handleSuccess('Thành công', 'Thêm dịch vụ thành công');
          this.closeEditDialog();
          this.loadServices();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorHandler.handleError(error, 'thêm dịch vụ');
          this.isSubmitting = false;
        }
      });
    }
  }

  
  
  closeViewDialog() {
    this.viewDialog = false;
    this.selectedService = null;
    
    
    setTimeout(() => {
      window.scrollTo(0, this.scrollPosition);
    }, 0);
  }
  
  closeEditDialog() {
    this.editDialog = false;
    this.selectedService = null;
    this.serviceForm.reset();
    
    
    setTimeout(() => {
      window.scrollTo(0, this.scrollPosition);
    }, 0);
  }
  
  markFormGroupTouched() {
    Object.keys(this.serviceForm.controls).forEach(key => {
      this.serviceForm.get(key)?.markAsTouched();
    });
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  
  getFieldError(fieldName: string): string {
    const field = this.serviceForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Trường này là bắt buộc';
    }
    
    if (field?.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Độ dài tối thiểu là ${minLength} ký tự`;
    }
    
    if (field?.hasError('min')) {
      return 'Giá trị phải lớn hơn 0';
    }
    
    return 'Trường không hợp lệ';
  }

  
  formatCurrency(value: number): string {
    if (value === null || value === undefined) {
      return '0 VNĐ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' VNĐ';
  }
  
  formatDuration(days: number): string {
    return days ? `${days} ngày` : '';
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
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

  
  calculateScrollbarWidth() {
    
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);

    
    const inner = document.createElement('div');
    outer.appendChild(inner);

    
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    
    
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    
    
    document.body.removeChild(outer);
  }
}