import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { StudentService } from '../../../services/student.service';
import { SchoolService } from '../../../services/school.service';
import { ClassService } from '../../../services/class.service';
import { StudentResponse } from '../../../models/student';
import { SchoolResponse } from '../../../models/school';
import { ClassResponse } from '../../../models/class';
import { BaseResponse, ApiResponse } from '../../../models/base-response';
import { ErrorHandlerService } from '../../../services/error-handler.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  students: StudentResponse[] = [];
  schools: SchoolResponse[] = [];
  classes: ClassResponse[] = [];
  allClasses: ClassResponse[] = [];
  loading: boolean = false;
  
  // Filter properties
  selectedSchool: string = ''; // Thêm property này
  selectedClass: string = '';
  searchValue: string = '';
  
  // Pagination
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  constructor(
    private studentService: StudentService,
    private schoolService: SchoolService,
    private classService: ClassService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService // Inject ErrorHandlerService
  ) {}

  ngOnInit() {
    this.loadSchools();
    this.loadAllClasses();
    this.loadStudents();
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

  loadAllClasses() {
    this.classService.getAllClasses().subscribe({
      next: (response: BaseResponse<ClassResponse[]>) => {
        this.allClasses = response.data;
        this.classes = [...this.allClasses]; // Hiển thị tất cả lớp ban đầu
      },
      error: (error: any) => {
        this.errorHandler.handleError(error, 'tải danh sách lớp học');
      }
    });
  }

  onSchoolChange() {
    // Reset về trang đầu khi thay đổi filter
    this.first = 0;
    
    if (this.selectedSchool) {
      // Lọc lớp theo trường được chọn
      this.classes = this.allClasses.filter(c => c.schoolCode === this.selectedSchool);
      
      // Reset lớp đã chọn nếu không thuộc trường mới
      if (this.selectedClass) {
        const classExists = this.classes.find(c => c.classCode === this.selectedClass);
        if (!classExists) {
          this.selectedClass = '';
        }
      }
    } else {
      // Hiển thị tất cả lớp khi không chọn trường
      this.classes = [...this.allClasses];
      this.selectedClass = '';
    }
    
    this.loadStudents();
  }

  onClassChange() {
    // Reset về trang đầu khi thay đổi filter
    this.first = 0;
    
    // Tự động chọn trường tương ứng khi chọn lớp
    if (this.selectedClass && !this.selectedSchool) {
      const selectedClassObj = this.allClasses.find(c => c.classCode === this.selectedClass);
      if (selectedClassObj) {
        this.selectedSchool = selectedClassObj.schoolCode;
        this.classes = this.allClasses.filter(c => c.schoolCode === this.selectedSchool);
      }
    }
    
    this.loadStudents();
  }

  loadStudents() {
    if (this.searchValue.trim()) {
      this.searchStudents();
      return;
    }

    this.loading = true;
    
    if (this.selectedClass) {
      // Load students by class
      this.studentService.getStudentsByClass(this.selectedClass).subscribe({
        next: (response: BaseResponse<StudentResponse[]>) => {
          this.students = response.data;
          this.totalRecords = this.students.length;
          this.loading = false;
        },
        error: (error: any) => {
          this.errorHandler.handleError(error, 'tải danh sách học sinh');
          this.loading = false;
        }
      });
    } else if (this.selectedSchool) {
      // Load students by school
      this.studentService.getAllStudents().subscribe({
        next: (response: BaseResponse<StudentResponse[]>) => {
          // Lọc học sinh theo trường được chọn
          const schoolClasses = this.allClasses.filter(c => c.schoolCode === this.selectedSchool);
          const schoolClassCodes = schoolClasses.map(c => c.classCode);
          
          this.students = response.data.filter(student => 
            schoolClassCodes.includes(student.classCode)
          );
          this.totalRecords = this.students.length;
          this.loading = false;
        },
        error: (error: any) => {
          this.errorHandler.handleError(error, 'tải danh sách học sinh theo trường');
          this.loading = false;
        }
      });
    } else {
      // Load all students
      this.studentService.getAllStudents().subscribe({
        next: (response: BaseResponse<StudentResponse[]>) => {
          this.students = response.data;
          this.totalRecords = this.students.length;
          this.loading = false;
        },
        error: (error: any) => {
          this.errorHandler.handleError(error, 'tải danh sách học sinh');
          this.loading = false;
        }
      });
    }
  }

  searchStudents() {
    if (!this.searchValue.trim()) {
      this.loadStudents();
      return;
    }

    this.loading = true;
    const page = Math.floor(this.first / this.rows);
    
    this.studentService.searchStudentsByName(this.searchValue, page, this.rows).subscribe({
      next: (response: ApiResponse<StudentResponse[]>) => {
        this.students = response.data;
        this.totalRecords = response.countItems;
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tìm kiếm học sinh',
          life: 5000
        });
        this.loading = false;
      }
    });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadStudents();
  }

  createStudent() {
    this.router.navigate(['/students/create']);
  }

  editStudent(student: StudentResponse) {
    this.router.navigate(['/students/edit', student.id]);
  }

  viewStudent(student: StudentResponse) {
    this.router.navigate(['/students/view', student.id]);
  }

  deleteStudent(student: StudentResponse) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa học sinh "${student.name}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.studentService.deleteStudent(student.id).subscribe({
          next: (response: BaseResponse<any>) => {
            this.errorHandler.handleSuccess('Thành công', 'Xóa học sinh thành công');
            this.loadStudents();
          },
          error: (error: any) => {
            this.errorHandler.handleError(error, 'xóa học sinh');
          }
        });
      }
    });
  }

  getClassName(classCode: string): string {
    const classItem = this.allClasses.find(c => c.classCode === classCode);
    return classItem ? classItem.name : classCode;
  }

  getSchoolName(classCode: string): string {
    const classItem = this.allClasses.find(c => c.classCode === classCode);
    if (classItem) {
      const school = this.schools.find(s => s.schoolCode === classItem.schoolCode);
      return school ? school.schoolName : classItem.schoolCode;
    }
    return '';
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    
    // Nếu date là string với format dd-MM-yyyy từ backend
    if (typeof date === 'string') {
      // Parse string "26-08-2004" thành Date object
      const parts = date.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month trong JS bắt đầu từ 0
        const year = parseInt(parts[2]);
        const parsedDate = new Date(year, month, day);
        
        // Kiểm tra nếu date hợp lệ
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toLocaleDateString('vi-VN');
        }
      }
      return 'Invalid Date';
    }
    
    // Nếu date đã là Date object
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleDateString('vi-VN');
  }

  onSearch() {
    this.first = 0; // Reset to first page when searching
    this.loadStudents();
  }

  clearSearch() {
    this.searchValue = '';
    this.first = 0;
    this.loadStudents();
  }

  clearFilters() {
    this.selectedSchool = '';
    this.selectedClass = '';
    this.searchValue = '';
    this.first = 0;
    this.classes = [...this.allClasses]; // Reset về tất cả lớp
    this.loadStudents();
  }
}