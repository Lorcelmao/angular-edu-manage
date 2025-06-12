import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { GoiDichVuService } from '../../../services/goi-dich-vu.service';
import { DichVuService } from '../../../services/dich-vu.service'; // Đã thay đổi tên import
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { 
  GoiDichVuRequest, 
  GoiDichVuUpdateRequest, 
  GoiDichVuResponse, 
  ServiceItem 
} from '../../../models/goi-dich-vu';
import { ServiceResponse } from '../../../models/service';
import { BaseResponse } from '../../../models/base-response';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-goi-dich-vu-form',
  templateUrl: './goi-dich-vu-form.component.html',
  styleUrls: ['./goi-dich-vu-form.component.scss']
})
export class GoiDichVuFormComponent implements OnInit {
  goiDichVuForm: FormGroup;
  loading: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  goiDichVuId: string | null = null;
  pageTitle: string = 'Thêm gói dịch vụ';
  
  
  services: ServiceResponse[] = [];
  
  availableServices: ServiceResponse[] = [];
  selectedService: string = '';
  serviceTypes = [
    { label: 'Dịch vụ chính', value: 'dichvuchinh' },
    { label: 'Dịch vụ thêm', value: 'dichvuthem' },
    { label: 'Nội dung đặc điểm', value: 'noiDungDacDiem' }
  ];
  servicesLoading: boolean = false;

  
  goiDichVu: GoiDichVuResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private goiDichVuService: GoiDichVuService,
    private dichVuService: DichVuService, // Thay đổi serviceService sang dichVuService
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private confirmationService: ConfirmationService
  ) {
    this.goiDichVuForm = this.fb.group({
      tenGoi: ['', [Validators.required, Validators.minLength(2)]],
      moTa: ['', [Validators.required, Validators.minLength(10)]],
      giaGoi: ['', [Validators.required, Validators.min(0)]],
      phuongThucThanhToan: [''],
      chiPhiPhatSinh: ['']
    });
  }

  ngOnInit() {
    
    const url = this.router.url;
    
    
    this.isViewMode = url.includes('/view');
    this.isEditMode = url.includes('/edit');
    
    
    this.goiDichVuId = this.route.snapshot.paramMap.get('id');
    
    
    if (this.isEditMode) {
      this.pageTitle = 'Chỉnh sửa gói dịch vụ';
    } else if (this.isViewMode) {
      this.pageTitle = 'Chi tiết gói dịch vụ';
      this.goiDichVuForm.disable();
    }
    
    
    if (this.goiDichVuId) {
      this.loadGoiDichVu();
      this.loadServicesInPackage();
      if (this.isViewMode || this.isEditMode) {
        this.loadAvailableServices();
      }
    }
  }

  loadGoiDichVu() {
    if (!this.goiDichVuId) return;
    
    this.loading = true;
    this.goiDichVuService.getGoiDichVuById(this.goiDichVuId).subscribe({
      next: (response: BaseResponse<GoiDichVuResponse>) => {
        this.goiDichVu = response.data; 
        this.goiDichVuForm.patchValue({
          tenGoi: this.goiDichVu.tenGoi,
          moTa: this.goiDichVu.moTa,
          giaGoi: this.goiDichVu.giaGoi,
          phuongThucThanhToan: this.goiDichVu.phuongThucThanhToan || '',
          chiPhiPhatSinh: this.goiDichVu.chiPhiPhatSinh || ''
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải thông tin gói dịch vụ');
        this.loading = false;
        this.goBack();
      }
    });
  }

  loadServicesInPackage() {
    if (!this.goiDichVuId) return;
    
    this.servicesLoading = true;
    this.goiDichVuService.getServicesByPackageId(this.goiDichVuId).subscribe({
      next: (response: BaseResponse<ServiceResponse[]>) => {
        this.services = response.data;
        this.servicesLoading = false;
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải danh sách dịch vụ trong gói');
        this.servicesLoading = false;
      }
    });
  }

  loadAvailableServices() {
    if (!this.goiDichVuId) return;
    
    this.goiDichVuService.getServicesNotInPackage(this.goiDichVuId).subscribe({
      next: (response: BaseResponse<ServiceResponse[]>) => {
        this.availableServices = response.data;
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải danh sách dịch vụ có thể thêm');
      }
    });
  }

  onSubmit() {
    if (this.goiDichVuForm.invalid || this.isViewMode) {
      this.markFormGroupTouched();
      this.errorHandler.handleWarning('Cảnh báo', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    this.loading = true;
    const formValue = this.goiDichVuForm.value;

    if (this.isEditMode && this.goiDichVuId) {
      const updateRequest: GoiDichVuUpdateRequest = {
        tenGoi: formValue.tenGoi,
        moTa: formValue.moTa,
        giaGoi: Number(formValue.giaGoi),
        phuongThucThanhToan: formValue.phuongThucThanhToan,
        chiPhiPhatSinh: formValue.chiPhiPhatSinh
      };
      
      this.goiDichVuService.updateGoiDichVu(this.goiDichVuId, updateRequest).subscribe({
        next: (response: BaseResponse<GoiDichVuResponse>) => {
          this.errorHandler.handleSuccess('Thành công', 'Cập nhật gói dịch vụ thành công');
          this.loading = false;
          setTimeout(() => {
            this.goBack();
          }, 1000);
        },
        error: (error: any) => {
          this.errorHandler.handleError(error, 'cập nhật gói dịch vụ');
          this.loading = false;
        }
      });
    } else {
      const createRequest: GoiDichVuRequest = {
        tenGoi: formValue.tenGoi,
        moTa: formValue.moTa,
        giaGoi: Number(formValue.giaGoi),
        phuongThucThanhToan: formValue.phuongThucThanhToan,
        chiPhiPhatSinh: formValue.chiPhiPhatSinh
      };
      
      this.goiDichVuService.createGoiDichVu(createRequest).subscribe({
        next: (response: BaseResponse<GoiDichVuResponse>) => {
          this.errorHandler.handleSuccess('Thành công', 'Thêm gói dịch vụ thành công');
          this.loading = false;
          setTimeout(() => {
            this.goBack();
          }, 1000);
        },
        error: (error: any) => {
          this.errorHandler.handleError(error, 'thêm gói dịch vụ');
          this.loading = false;
        }
      });
    }
  }

  getServicesByType(type: string): ServiceItem[] {
    if (!this.goiDichVu) return [];
    
    switch(type) {
      case 'dichvuchinh':
        return this.goiDichVu.dichvuchinh || [];
      case 'dichvuthem':
        return this.goiDichVu.dichvuthem || [];
      case 'noiDungDacDiem':
        return this.goiDichVu.noiDungDacDiem || []; 
      default:
        return [];
    }
  }

  getServiceCountByType(type: string): number {
    return this.getServicesByType(type).length;
  }

  addServiceToPackage() {
    if (!this.selectedService || !this.goiDichVuId) {
      this.errorHandler.handleWarning('Cảnh báo', 'Vui lòng chọn dịch vụ để thêm vào gói');
      return;
    }

    this.goiDichVuService.addServiceToPackage(
      this.goiDichVuId, 
      this.selectedService
    ).subscribe({
      next: (response) => {
        this.errorHandler.handleSuccess('Thành công', 'Thêm dịch vụ vào gói thành công');
        this.selectedService = '';
        
        this.loadGoiDichVu();
        this.loadAvailableServices(); 
      },
      error: (error) => {
        this.errorHandler.handleError(error, 'thêm dịch vụ vào gói');
      }
    });
  }

  removeServiceFromPackage(service: ServiceItem, serviceType: string) {
    if (!this.goiDichVuId) return;

    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa dịch vụ "${service.tenDichVu}" khỏi gói?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.goiDichVuService.removeServiceFromPackage(this.goiDichVuId!, service.id, serviceType).subscribe({
          next: (response) => {
            this.errorHandler.handleSuccess('Thành công', 'Xóa dịch vụ khỏi gói thành công');
            this.loadGoiDichVu(); 
          },
          error: (error) => {
            this.errorHandler.handleError(error, 'xóa dịch vụ khỏi gói');
          }
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/goi-dich-vu']);
  }

  private markFormGroupTouched() {
    Object.keys(this.goiDichVuForm.controls).forEach(key => {
      const control = this.goiDichVuForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.goiDichVuForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.goiDichVuForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        switch(fieldName) {
          case 'tenGoiDichVu': return 'Tên gói dịch vụ không được để trống';
          case 'moTa': return 'Mô tả không được để trống';
          case 'giaTien': return 'Giá không được để trống';
          default: return 'Trường này không được để trống';
        }
      }
      if (field.errors['minlength']) {
        switch(fieldName) {
          case 'tenGoiDichVu': return 'Tên gói dịch vụ phải có ít nhất 2 ký tự';
          case 'moTa': return 'Mô tả phải có ít nhất 10 ký tự';
          default: return 'Độ dài không hợp lệ';
        }
      }
      if (field.errors['min']) {
        switch(fieldName) {
          case 'giaTien': return 'Giá phải lớn hơn hoặc bằng 0';
          default: return 'Giá trị không hợp lệ';
        }
      }
    }
    return '';
  }

  formatCurrency(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' VNĐ';
  }

  calculateTotalPackagePrice(): number {
    
    const basePrice = this.goiDichVuForm.get('giaGoi')?.value || 0;
    return Number(basePrice);
  }

  calculateTotalServicesPrice(): number {
    return this.services.reduce((total, service) => total + service.giaTien, 0);
  }

  
  convertMillisToDay(milliseconds: number | null | undefined): number {
    if (milliseconds === null || milliseconds === undefined) {
      return 0;
    }
    
    return Math.round((milliseconds / 86400000) * 100) / 100; 
  }

  
  calculateTotalDeliveryTime(): number {
    if (!this.goiDichVu) return 0;
    
    let maxTimeMillis = 0;
    
    if (this.goiDichVu.dichvuchinh?.length) {
      this.goiDichVu.dichvuchinh.forEach(service => {
        if (service.deliveryTime > maxTimeMillis) {
          maxTimeMillis = service.deliveryTime;
        }
      });
    }
    
    
    return this.convertMillisToDay(maxTimeMillis);
  }
}