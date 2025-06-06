import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SchoolService } from '../../../services/school.service';
import { SchoolRequest, SchoolUpdateRequest, SchoolResponse } from '../../../models/school';

@Component({
  selector: 'app-school-form',
  templateUrl: './school-form.component.html',
  styleUrls: ['./school-form.component.scss']
})
export class SchoolFormComponent implements OnInit {
  schoolForm: FormGroup;
  loading: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  schoolId: string | null = null;
  pageTitle: string = 'Thêm trường học';

  constructor(
    private fb: FormBuilder,
    private schoolService: SchoolService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.schoolForm = this.fb.group({
      schoolName: ['', [Validators.required, Validators.minLength(3)]],
      schoolAddress: ['', [Validators.required, Validators.minLength(5)]],
      schoolCode: [{value: '', disabled: true}]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(url => {
      const mode = url[url.length - 2]?.path;
      this.schoolId = this.route.snapshot.paramMap.get('id');
      
      if (mode === 'edit') {
        this.isEditMode = true;
        this.pageTitle = 'Chỉnh sửa trường học';
        this.schoolForm.get('schoolCode')?.enable();
      } else if (mode === 'view') {
        this.isViewMode = true;
        this.pageTitle = 'Chi tiết trường học';
        this.schoolForm.disable();
      }
      
      if (this.schoolId) {
        this.loadSchool();
      }
    });
  }

  loadSchool() {
    if (!this.schoolId) return;
    
    this.loading = true;
    this.schoolService.getSchoolById(this.schoolId).subscribe({
      next: (response) => {
        const school = response.data;
        this.schoolForm.patchValue({
          schoolName: school.schoolName,
          schoolAddress: school.schoolAddress,
          schoolCode: school.schoolCode
        });
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải thông tin trường học'
        });
        this.loading = false;
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.schoolForm.invalid || this.isViewMode) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.schoolForm.value;

    if (this.isEditMode && this.schoolId) {
      const updateRequest: SchoolUpdateRequest = {
        schoolName: formValue.schoolName,
        schoolAddress: formValue.schoolAddress,
        schoolCode: formValue.schoolCode
      };
      
      this.schoolService.updateSchool(this.schoolId, updateRequest).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật trường học thành công'
          });
          this.loading = false;
          this.goBack();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật trường học'
          });
          this.loading = false;
        }
      });
    } else {
      const createRequest: SchoolRequest = {
        schoolName: formValue.schoolName,
        schoolAddress: formValue.schoolAddress
      };
      
      this.schoolService.createSchool(createRequest).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm trường học thành công'
          });
          this.loading = false;
          this.goBack();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể thêm trường học'
          });
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/schools']);
  }

  private markFormGroupTouched() {
    Object.keys(this.schoolForm.controls).forEach(key => {
      const control = this.schoolForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.schoolForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.schoolForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName === 'schoolName' ? 'Tên trường' : 'Địa chỉ'} không được để trống`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${fieldName === 'schoolName' ? 'Tên trường' : 'Địa chỉ'} phải có ít nhất ${minLength} ký tự`;
      }
    }
    return '';
  }
}