import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { StudentService } from '../../../services/student.service';
import { SchoolService } from '../../../services/school.service';
import { ClassService } from '../../../services/class.service';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import { StudentRequest, StudentResponse } from '../../../models/student';
import { SchoolResponse } from '../../../models/school';
import { ClassResponse } from '../../../models/class';
import { BaseResponse } from '../../../models/base-response';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  loading: boolean = false;
  isEditMode: boolean = false;
  isViewMode: boolean = false;
  studentId: string | null = null;
  pageTitle: string = 'Thêm học sinh';
  schools: SchoolResponse[] = [];
  classes: ClassResponse[] = [];
  allClasses: ClassResponse[] = [];
  selectedSchool: string = '';
  
  // Thêm property maxDate để sử dụng trong template
  maxDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private schoolService: SchoolService,
    private classService: ClassService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService // Inject ErrorHandlerService
  ) {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      birthday: ['', [Validators.required]],
      schoolCode: [''],
      classCode: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // Load schools và classes trước, sau đó mới load student
    this.loadSchools();
    this.loadAllClassesThenLoadStudent();
    
    this.route.url.subscribe(url => {
      const mode = url[url.length - 2]?.path;
      this.studentId = this.route.snapshot.paramMap.get('id');
      
      if (mode === 'edit') {
        this.isEditMode = true;
        this.pageTitle = 'Chỉnh sửa học sinh';
      } else if (mode === 'view') {
        this.isViewMode = true;
        this.pageTitle = 'Chi tiết học sinh';
        this.studentForm.disable();
      }
    });
  }

  loadSchools() {
    this.schoolService.getAllSchools().subscribe({
      next: (response: BaseResponse<SchoolResponse[]>) => {
        this.schools = response.data;
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải danh sách trường học');
      }
    });
  }

  loadAllClassesThenLoadStudent() {
    this.classService.getAllClasses().subscribe({
      next: (response: BaseResponse<ClassResponse[]>) => {
        this.allClasses = response.data;
        this.classes = [...this.allClasses];
        
        // Sau khi load classes xong, mới load student
        if (this.studentId) {
          this.loadStudent();
        }
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải danh sách lớp học');
      }
    });
  }

  onSchoolChange() {
    const schoolCode = this.studentForm.get('schoolCode')?.value;
    this.selectedSchool = schoolCode || '';
    
    if (this.selectedSchool) {
      this.classes = this.allClasses.filter(c => c.schoolCode === this.selectedSchool);
    } else {
      this.classes = [...this.allClasses];
    }
    
    // Clear class selection if current class doesn't belong to selected school
    const currentClass = this.studentForm.get('classCode')?.value;
    if (currentClass && this.selectedSchool) {
      const classExists = this.classes.find(c => c.classCode === currentClass);
      if (!classExists) {
        this.studentForm.get('classCode')?.setValue('');
      }
    }
  }

  onClassChange() {
    const selectedClassCode = this.studentForm.get('classCode')?.value;
    if (selectedClassCode) {
      const selectedClass = this.allClasses.find(c => c.classCode === selectedClassCode);
      if (selectedClass) {
        this.selectedSchool = selectedClass.schoolCode;
        this.studentForm.get('schoolCode')?.setValue(selectedClass.schoolCode);
        this.onSchoolChange();
      }
    }
  }

  loadStudent() {
    if (!this.studentId || this.allClasses.length === 0) return;
    
    this.loading = true;
    this.studentService.getStudentById(this.studentId).subscribe({
      next: (response: BaseResponse<StudentResponse>) => {
        const student = response.data;
        
        // Parse ngày sinh từ backend format "dd-MM-yyyy"
        const parsedBirthday = this.parseBackendDate(student.birthday as string);
        
        // Tìm class để lấy schoolCode TRƯỚC KHI set form values
        const studentClass = this.allClasses.find(c => c.classCode === student.classCode);
        
        // Set form values bao gồm cả schoolCode
        this.studentForm.patchValue({
          name: student.name,
          birthday: parsedBirthday,
          classCode: student.classCode,
          schoolCode: studentClass ? studentClass.schoolCode : '' // Set schoolCode ngay lập tức
        });
        
        // Update UI state
        if (studentClass) {
          this.selectedSchool = studentClass.schoolCode;
          this.classes = this.allClasses.filter(c => c.schoolCode === this.selectedSchool);
        }
        
        this.loading = false;
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải thông tin học sinh');
        this.loading = false;
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.studentForm.valid) {
      this.loading = true;
      
      const formValue = this.studentForm.value;
      const studentData: StudentRequest = {
        name: formValue.name,
        birthday: formValue.birthday,
        classCode: formValue.classCode
      };

      if (this.isEditMode && this.studentId) {
        this.studentService.updateStudent(this.studentId, studentData).subscribe({
          next: (response: BaseResponse<any>) => {
            this.errorHandler.handleSuccess('Thành công', 'Cập nhật học sinh thành công');
            this.loading = false;
            this.goBack();
          },
          error: (error: any) => {
            this.errorHandler.handleError(error, 'cập nhật học sinh');
            this.loading = false;
          }
        });
      } else {
        this.studentService.createStudent(studentData).subscribe({
          next: (response: BaseResponse<any>) => {
            this.errorHandler.handleSuccess('Thành công', 'Tạo học sinh thành công');
            this.loading = false;
            this.goBack();
          },
          error: (error: any) => {
            this.errorHandler.handleError(error, 'tạo học sinh');
            this.loading = false;
          }
        });
      }
    } else {
      this.errorHandler.handleWarning('Cảnh báo', 'Vui lòng kiểm tra lại thông tin đã nhập');
    }
  }

  goBack() {
    this.router.navigate(['/students']);
  }

  private markFormGroupTouched() {
    Object.keys(this.studentForm.controls).forEach(key => {
      const control = this.studentForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.studentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.studentForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        switch(fieldName) {
          case 'name': return 'Tên học sinh không được để trống';
          case 'birthday': return 'Ngày sinh không được để trống';
          case 'classCode': return 'Lớp học không được để trống';
          default: return 'Trường này không được để trống';
        }
      }
      if (field.errors['minlength']) {
        return 'Tên học sinh phải có ít nhất 2 ký tự';
      }
    }
    return '';
  }

  // Cập nhật method getSchoolName
  getSchoolName(schoolCode: string): string {
    const school = this.schools.find(s => s.schoolCode === schoolCode);
    return school ? school.schoolName : schoolCode;
  }

  parseBackendDate(dateString: string): Date | null {
    if (!dateString) return null;
    
    // Parse string "26-08-2004" thành Date object
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month trong JS bắt đầu từ 0
      const year = parseInt(parts[2]);
      const parsedDate = new Date(year, month, day);
      
      // Kiểm tra nếu date hợp lệ
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    
    return null;
  }
}