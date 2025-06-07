import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClassService } from '../../../services/class.service';
import { SchoolService } from '../../../services/school.service';
import { ClassRequest, ClassUpdateRequest, ClassResponse } from '../../../models/class';
import { SchoolResponse } from '../../../models/school';
import { BaseResponse } from '../../../models/base-response';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.scss']
})
export class ClassFormComponent implements OnInit {
  classForm: FormGroup;
  loading: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  classId: string | null = null;
  pageTitle: string = 'Thêm lớp học';
  schools: SchoolResponse[] = [];
  grades: any[] = [
    { label: 'Lớp 1', value: 1 },
    { label: 'Lớp 2', value: 2 },
    { label: 'Lớp 3', value: 3 },
    { label: 'Lớp 4', value: 4 },
    { label: 'Lớp 5', value: 5 },
    { label: 'Lớp 6', value: 6 },
    { label: 'Lớp 7', value: 7 },
    { label: 'Lớp 8', value: 8 },
    { label: 'Lớp 9', value: 9 },
    { label: 'Lớp 10', value: 10 },
    { label: 'Lớp 11', value: 11 },
    { label: 'Lớp 12', value: 12 }
  ];

  constructor(
    private fb: FormBuilder,
    private classService: ClassService,
    private schoolService: SchoolService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.classForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      grade: ['', [Validators.required]],
      schoolCode: ['', [Validators.required]],
      classCode: [{value: '', disabled: true}]
    });
  }

  ngOnInit() {
    this.loadSchools();
    
    this.route.url.subscribe(url => {
      const mode = url[url.length - 2]?.path;
      this.classId = this.route.snapshot.paramMap.get('id');
      
      if (mode === 'edit') {
        this.isEditMode = true;
        this.pageTitle = 'Chỉnh sửa lớp học';
        this.classForm.get('classCode')?.enable();
      } else if (mode === 'view') {
        this.isViewMode = true;
        this.pageTitle = 'Chi tiết lớp học';
        this.classForm.disable();
      }
      
      if (this.classId) {
        this.loadClass();
      }
    });
  }

  loadSchools() {
    this.schoolService.getAllSchools().subscribe({
      next: (response: BaseResponse<SchoolResponse[]>) => {
        this.schools = response.data;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách trường học',
          life: 5000
        });
      }
    });
  }

  loadClass() {
    if (!this.classId) return;
    
    this.loading = true;
    this.classService.getClassById(this.classId).subscribe({
      next: (response: BaseResponse<ClassResponse>) => {
        const classData = response.data;
        this.classForm.patchValue({
          name: classData.name,
          grade: classData.grade,
          schoolCode: classData.schoolCode,
          classCode: classData.classCode
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải thông tin lớp học',
          life: 5000
        });
        this.loading = false;
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.classForm.invalid || this.isViewMode) {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        life: 4000
      });
      return;
    }

    this.loading = true;
    const formValue = this.classForm.value;

    if (this.isEditMode && this.classId) {
      const updateRequest: ClassUpdateRequest = {
        name: formValue.name,
        grade: formValue.grade,
        schoolCode: formValue.schoolCode,
        classCode: formValue.classCode
      };
      
      this.classService.updateClass(this.classId, updateRequest).subscribe({
        next: (response: BaseResponse<ClassResponse>) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Cập nhật lớp học thành công',
            life: 4000
          });
          this.loading = false;
          
          setTimeout(() => {
            this.goBack();
          }, 1000);
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể cập nhật lớp học',
            life: 5000
          });
          this.loading = false;
        }
      });
    } else {
      const createRequest: ClassRequest = {
        name: formValue.name,
        grade: formValue.grade,
        schoolCode: formValue.schoolCode
      };
      
      this.classService.createClass(createRequest).subscribe({
        next: (response: BaseResponse<ClassResponse>) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Thêm lớp học thành công',
            life: 4000
          });
          this.loading = false;
          
          setTimeout(() => {
            this.goBack();
          }, 1000);
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Lỗi',
            detail: 'Không thể thêm lớp học',
            life: 5000
          });
          this.loading = false;
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/classes']);
  }

  private markFormGroupTouched() {
    Object.keys(this.classForm.controls).forEach(key => {
      const control = this.classForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.classForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.classForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        switch(fieldName) {
          case 'name': return 'Tên lớp không được để trống';
          case 'grade': return 'Khối lớp không được để trống';
          case 'schoolCode': return 'Trường học không được để trống';
          default: return 'Trường này không được để trống';
        }
      }
      if (field.errors['minlength']) {
        return 'Tên lớp phải có ít nhất 1 ký tự';
      }
    }
    return '';
  }
}