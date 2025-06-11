import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ServiceService } from '../../../services/service.service';
import { ServiceRequest, ServiceUpdateRequest, ServiceResponse } from '../../../models/service';
import { BaseResponse } from '../../../models/base-response';
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {
  serviceForm: FormGroup;
  loading: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  serviceId: string | null = null;
  pageTitle: string = 'Thêm dịch vụ';

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService
  ) {
    this.serviceForm = this.fb.group({
      tenDichVu: ['', [Validators.required, Validators.minLength(2)]],
      moTa: ['', [Validators.required, Validators.minLength(10)]],
      giaTien: ['', [Validators.required, Validators.min(0)]],
      deliveryTime: ['', [Validators.required, Validators.min(1)]],
      isActive: [true]
    });
  }

  ngOnInit() {
    // Lấy URL hiện tại
    const url = this.router.url;
    
    // Kiểm tra mode từ URL
    this.isViewMode = url.includes('/view');
    this.isEditMode = url.includes('/edit');
    
    // Lấy ID từ route params
    this.serviceId = this.route.snapshot.paramMap.get('id');
    
    // Cập nhật tiêu đề và trạng thái form
    if (this.isEditMode) {
      this.pageTitle = 'Chỉnh sửa dịch vụ';
    } else if (this.isViewMode) {
      this.pageTitle = 'Chi tiết dịch vụ';
      this.serviceForm.disable();
    }
    
    // Nếu có ID, load dữ liệu dịch vụ
    if (this.serviceId) {
      this.loadService();
    }
  }

  loadService() {
    if (!this.serviceId) return;
    
    this.loading = true;
    this.serviceService.getServiceById(this.serviceId).subscribe({
      next: (response: BaseResponse<ServiceResponse>) => {
        const serviceData = response.data;
        this.serviceForm.patchValue({
          tenDichVu: serviceData.tenDichVu,
          moTa: serviceData.moTa,
          giaTien: serviceData.giaTien,
          deliveryTime: serviceData.deliveryTime
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải thông tin dịch vụ');
        this.loading = false;
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.serviceForm.invalid || this.isViewMode) {
      this.markFormGroupTouched();
      this.errorHandler.handleWarning('Cảnh báo', 'Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    this.loading = true;
    const formValue = this.serviceForm.value;

    if (this.isEditMode && this.serviceId) {
      const updateRequest: ServiceUpdateRequest = {
        tenDichVu: formValue.tenDichVu,
        moTa: formValue.moTa,
        giaTien: Number(formValue.giaTien),
        deliveryTime: Number(formValue.deliveryTime)
      };
      
      this.serviceService.updateService(this.serviceId, updateRequest).subscribe({
        next: (response: BaseResponse<ServiceResponse>) => {
          this.errorHandler.handleSuccess('Thành công', 'Cập nhật dịch vụ thành công');
          this.loading = false;
          setTimeout(() => {
            this.goBack();
          }, 1000);
        },
        error: (error: any) => {
          this.errorHandler.handleError(error, 'cập nhật dịch vụ');
          this.loading = false;
        }
      });
    } else {
      const createRequest: ServiceRequest = {
        tenDichVu: formValue.tenDichVu,
        moTa: formValue.moTa,
        giaTien: Number(formValue.giaTien),
        deliveryTime: Number(formValue.deliveryTime)
      };
      
      this.serviceService.createService(createRequest).subscribe({
        next: (response: BaseResponse<ServiceResponse>) => {
          this.errorHandler.handleSuccess('Thành công', 'Thêm dịch vụ thành công');
          this.loading = false;
          setTimeout(() => {
            this.goBack();
          }, 1000);
        },
        error: (error: any) => {
          this.errorHandler.handleError(error, 'thêm dịch vụ');
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/services']);
  }

  private markFormGroupTouched() {
    Object.keys(this.serviceForm.controls).forEach(key => {
      const control = this.serviceForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.serviceForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        switch(fieldName) {
          case 'tenDichVu': return 'Tên dịch vụ không được để trống';
          case 'moTa': return 'Mô tả không được để trống';
          case 'giaTien': return 'Giá không được để trống';
          case 'deliveryTime': return 'Thời gian không được để trống';
          default: return 'Trường này không được để trống';
        }
      }
      if (field.errors['minlength']) {
        switch(fieldName) {
          case 'tenDichVu': return 'Tên dịch vụ phải có ít nhất 2 ký tự';
          case 'moTa': return 'Mô tả phải có ít nhất 10 ký tự';
          default: return 'Độ dài không hợp lệ';
        }
      }
      if (field.errors['min']) {
        switch(fieldName) {
          case 'giaTien': return 'Giá phải lớn hơn hoặc bằng 0';
          case 'deliveryTime': return 'Thời gian phải lớn hơn 0 ngày';
          default: return 'Giá trị không hợp lệ';
        }
      }
    }
    return '';
  }
}