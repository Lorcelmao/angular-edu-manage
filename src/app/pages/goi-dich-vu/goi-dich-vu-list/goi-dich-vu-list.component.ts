import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GoiDichVuService } from '../../../services/goi-dich-vu.service';
import { GoiDichVuResponse, ServiceItem, GoiDichVuRequest, GoiDichVuUpdateRequest } from '../../../models/goi-dich-vu';
import { ApiResponse, BaseResponse } from '../../../models/base-response';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceResponse } from '../../../models/service';
import { DichVuService } from '../../../services/dich-vu.service';
import { convertMillisecondsToDays, formatDuration } from '../../../shared/utils/time-utils';

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
  
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  currentPage: number = 1;
  Math = Math;
  Number = Number; 
  
  expandedServicePackages: Set<string> = new Set();
  
  
  viewDialog: boolean = false;
  editDialog: boolean = false;
  createDialog: boolean = false;
  selectedGoiDichVu: GoiDichVuResponse | null = null;
  goiDichVuForm: FormGroup;
  isSubmitting: boolean = false;
  
  
  availableServices: ServiceResponse[] = [];
  selectedService: string = '';
  serviceTypes = [
    { label: 'Dịch vụ chính', value: 'dichvuchinh' },
    { label: 'Dịch vụ thêm', value: 'dichvuthem' },
    { label: 'Nội dung đặc điểm', value: 'noiDungDacDiem' }
  ];
  selectedServiceType: string = 'dichvuchinh';
  private scrollPosition = 0;
  
  constructor(
    private goiDichVuService: GoiDichVuService,
    private dichVuService: DichVuService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private fb: FormBuilder
  ) {
    this.goiDichVuForm = this.fb.group({
      tenGoi: ['', [Validators.required, Validators.minLength(2)]],
      moTa: ['', [Validators.required, Validators.minLength(10)]],
      giaGoi: [null, [Validators.required, Validators.min(0)]],
      phuongThucThanhToan: [''],
      chiPhiPhatSinh: [null]
    });
  }

  ngOnInit() {
    this.loadGoiDichVus();
    this.calculateScrollbarWidth();
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

  
  createGoiDichVu() {
    this.scrollPosition = window.pageYOffset;
    this.selectedGoiDichVu = null;
    this.goiDichVuForm.reset();
    
    setTimeout(() => {
      this.createDialog = true;
      
      setTimeout(() => {
        window.scrollTo({
          top: this.scrollPosition,
          behavior: 'auto'
        });
      }, 0);
    }, 0);
  }

  viewGoiDichVu(goiDichVu: GoiDichVuResponse) {
    this.scrollPosition = window.pageYOffset;
    this.selectedGoiDichVu = goiDichVu;
    this.loadAvailableServices(goiDichVu.id);
    
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

  editGoiDichVu(goiDichVu: GoiDichVuResponse) {
    this.scrollPosition = window.pageYOffset;
    this.selectedGoiDichVu = goiDichVu;
    this.goiDichVuForm.patchValue({
      tenGoi: goiDichVu.tenGoi,
      moTa: goiDichVu.moTa,
      giaGoi: goiDichVu.giaGoi,
      phuongThucThanhToan: goiDichVu.phuongThucThanhToan,
      chiPhiPhatSinh: goiDichVu.chiPhiPhatSinh
    });
    this.loadAvailableServices(goiDichVu.id);
    
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

  
  onSubmit() {
    if (this.goiDichVuForm.invalid) {
      this.markFormGroupTouched(this.goiDichVuForm);
      this.errorHandler.handleWarning('Cảnh báo', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    this.isSubmitting = true;
    const formValue = this.goiDichVuForm.value;

    if (this.selectedGoiDichVu) {
      
      const updateRequest: GoiDichVuUpdateRequest = {
        tenGoi: formValue.tenGoi,
        moTa: formValue.moTa,
        giaGoi: Number(formValue.giaGoi),
        phuongThucThanhToan: formValue.phuongThucThanhToan,
        chiPhiPhatSinh: formValue.chiPhiPhatSinh ? formValue.chiPhiPhatSinh.toString() : undefined
      };
      
      this.goiDichVuService.updateGoiDichVu(this.selectedGoiDichVu.id, updateRequest).subscribe({
        next: (response) => {
          this.errorHandler.handleSuccess('Thành công', 'Cập nhật gói dịch vụ thành công');
          this.closeDialogs();
          this.loadGoiDichVus();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorHandler.handleError(error, 'cập nhật gói dịch vụ');
          this.isSubmitting = false;
        }
      });
    } else {
      
      const createRequest: GoiDichVuRequest = {
        tenGoi: formValue.tenGoi,
        moTa: formValue.moTa,
        giaGoi: Number(formValue.giaGoi),
        phuongThucThanhToan: formValue.phuongThucThanhToan,
        chiPhiPhatSinh: formValue.chiPhiPhatSinh ? formValue.chiPhiPhatSinh.toString() : undefined
      };
      
      this.goiDichVuService.createGoiDichVu(createRequest).subscribe({
        next: (response) => {
          this.errorHandler.handleSuccess('Thành công', 'Thêm gói dịch vụ thành công');
          this.closeDialogs();
          this.loadGoiDichVus();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorHandler.handleError(error, 'thêm gói dịch vụ');
          this.isSubmitting = false;
        }
      });
    }
  }

  
  loadAvailableServices(goiDichVuId: string) {
    this.goiDichVuService.getServicesNotInPackage(goiDichVuId).subscribe({
      next: (response: BaseResponse<ServiceResponse[]>) => {
        this.availableServices = response.data;
      },
      error: (error) => {
        this.errorHandler.handleError(error, 'tải danh sách dịch vụ có thể thêm');
      }
    });
  }

  
  loadSelectedGoiDichVuDetails() {
    if (!this.selectedGoiDichVu) return;
    
    this.goiDichVuService.getGoiDichVuById(this.selectedGoiDichVu.id).subscribe({
      next: (response) => {
        this.selectedGoiDichVu = response.data;
      },
      error: (error) => {
        this.errorHandler.handleError(error, 'tải thông tin gói dịch vụ');
      }
    });
  }

  
  addServiceToPackage() {
    if (!this.selectedService || !this.selectedGoiDichVu) {
      this.errorHandler.handleWarning('Cảnh báo', 'Vui lòng chọn dịch vụ để thêm vào gói');
      return;
    }

    this.goiDichVuService.addServiceToPackage(
      this.selectedGoiDichVu.id, 
      this.selectedService
    ).subscribe({
      next: (response) => {
        this.errorHandler.handleSuccess('Thành công', 'Thêm dịch vụ vào gói thành công');
        this.selectedService = '';
        
        
        this.loadSelectedGoiDichVuDetails();
        
        
        this.loadAvailableServices(this.selectedGoiDichVu!.id);
        
        
        this.loadGoiDichVus();
      },
      error: (error) => {
        this.errorHandler.handleError(error, 'thêm dịch vụ vào gói');
      }
    });
  }

  
  removeServiceFromPackage(service: ServiceItem, serviceType: string) {
    if (!this.selectedGoiDichVu) return;

    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa dịch vụ "${service.tenDichVu}" khỏi gói?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goiDichVuService.removeServiceFromPackage(this.selectedGoiDichVu!.id, service.id, serviceType).subscribe({
          next: (response) => {
            this.errorHandler.handleSuccess('Thành công', 'Xóa dịch vụ khỏi gói thành công');
            this.loadGoiDichVus(); 
            this.loadAvailableServices(this.selectedGoiDichVu!.id);
          },
          error: (error) => {
            this.errorHandler.handleError(error, 'xóa dịch vụ khỏi gói');
          }
        });
      }
    });
  }

  
  calculateTotalServicesPrice(): number {
    if (!this.selectedGoiDichVu) return 0;
    
    let total = 0;
    
    if (this.selectedGoiDichVu.dichvuchinh) {
      total += this.selectedGoiDichVu.dichvuchinh.reduce((sum, service) => sum + service.giaTien, 0);
    }
    
    if (this.selectedGoiDichVu.dichvuthem) {
      total += this.selectedGoiDichVu.dichvuthem.reduce((sum, service) => sum + service.giaTien, 0);
    }
    
    if (this.selectedGoiDichVu.noiDungDacDiem) {
      total += this.selectedGoiDichVu.noiDungDacDiem.reduce((sum, service) => sum + service.giaTien, 0);
    }
    
    return total;
  }

  formatDuration(days: number): string {
    return formatDuration(days);
  }
  
  
  convertMillisToDay(millis: number): string {
    return convertMillisecondsToDays(millis);
  }

  
  calculateTotalDeliveryTime(goiDichVu?: GoiDichVuResponse): string {
    
    if (goiDichVu) {
      const services = [
        ...(goiDichVu.dichvuchinh || []),
        ...(goiDichVu.dichvuthem || []),
        ...(goiDichVu.noiDungDacDiem || [])
      ];
      
      if (services.length === 0) return formatDuration(0);
      
      
      const maxDeliveryTime = Math.max(...services.map(s => s.deliveryTime));
      return formatDuration(maxDeliveryTime);
    }
    
    
    if (!this.selectedGoiDichVu) return formatDuration(0);
    
    const services = [
      ...(this.selectedGoiDichVu.dichvuchinh || []),
      ...(this.selectedGoiDichVu.dichvuthem || []),
      ...(this.selectedGoiDichVu.noiDungDacDiem || [])
    ];
    
    if (services.length === 0) return formatDuration(0);
    
    
    const maxDeliveryTime = Math.max(...services.map(s => s.deliveryTime));
    return formatDuration(maxDeliveryTime);
  }

  
  closeDialogs() {
    this.viewDialog = false;
    this.editDialog = false;
    this.createDialog = false;
    this.selectedGoiDichVu = null;
    this.selectedService = '';
    this.availableServices = [];
    this.goiDichVuForm.reset();
    
    setTimeout(() => {
      window.scrollTo({
        top: this.scrollPosition,
        behavior: 'auto'
      });
    }, 0);
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.goiDichVuForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  
  getFieldError(fieldName: string): string {
    const field = this.goiDichVuForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'Trường này là bắt buộc';
    }
    
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Độ dài tối thiểu là ${minLength} ký tự`;
    }
    
    if (field?.hasError('min')) {
      return 'Giá trị phải lớn hơn 0';
    }
    
    return 'Trường không hợp lệ';
  }

  
  loadGoiDichVus() {
    this.loading = true;
    
    console.log('Đang tải dữ liệu trang:', this.currentPage, 'với', this.rows, 'gói dịch vụ/trang');
    
    this.goiDichVuService.getAllGoiDichVu(this.searchValue, this.currentPage, this.rows)
      .subscribe({
        next: (response: ApiResponse<GoiDichVuResponse[]>) => {
          this.goiDichVus = response.data;
          this.filteredGoiDichVus = response.data; 
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

  
  formatCurrency(value: number): string {
    if (value === null || value === undefined) {
      return '0 VNĐ';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' VNĐ';
  }
  
  
  
  
  
  formatDate(dateString: string | undefined): string {
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

  getServicesByType(type: string): ServiceItem[] {
    if (!this.selectedGoiDichVu) return [];
    
    switch(type) {
      case 'dichvuchinh':
        return this.selectedGoiDichVu.dichvuchinh || [];
      case 'dichvuthem':
        return this.selectedGoiDichVu.dichvuthem || [];
      case 'noiDungDacDiem':
        return this.selectedGoiDichVu.noiDungDacDiem || []; 
      default:
        return [];
    }
  }

  getServiceCountByType(type: string): number {
    return this.getServicesByType(type).length;
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


goToPage(page: number): void {
  if (page < 1 || page > this.getTotalPages()) return;
  
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


getMainServices(goiDichVu: GoiDichVuResponse): ServiceItem[] {
  return goiDichVu.dichvuchinh || [];
}

getAdditionalServices(goiDichVu: GoiDichVuResponse): ServiceItem[] {
  return goiDichVu.dichvuthem || [];
}

getFeatureServices(goiDichVu: GoiDichVuResponse): ServiceItem[] {
  return goiDichVu.noiDungDacDiem || [];
}

getServiceTooltip(service: ServiceItem): string {
  return `${service.tenDichVu} - ${this.formatCurrency(service.giaTien)} - ${this.formatDuration(service.deliveryTime)}`;
}


isServiceExpanded(goiDichVuId: string): boolean {
  return this.expandedServicePackages.has(goiDichVuId);
}

hasManyServices(goiDichVu: GoiDichVuResponse): boolean {
  const totalServices = (goiDichVu.dichvuchinh?.length || 0) + 
                        (goiDichVu.dichvuthem?.length || 0) + 
                        (goiDichVu.noiDungDacDiem?.length || 0);
  return totalServices > 3;
}

toggleServiceExpand(goiDichVuId: string, expand: boolean): void {
  if (expand) {
    this.expandedServicePackages.add(goiDichVuId);
  } else {
    this.expandedServicePackages.delete(goiDichVuId);
  }
}
}