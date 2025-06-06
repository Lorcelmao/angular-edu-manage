import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClassService } from '../../../services/class.service';
import { SchoolService } from '../../../services/school.service';
import { ClassResponse } from '../../../models/class';
import { SchoolResponse } from '../../../models/school';
import { BaseResponse, ApiResponse } from '../../../models/base-response';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {
  classes: ClassResponse[] = [];
  schools: SchoolResponse[] = [];
  loading: boolean = false;
  
  // Filter properties
  selectedSchool: string = '';
  selectedGrade: number | null = null;
  searchValue: string = '';
  
  // Grade options
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
    private classService: ClassService,
    private schoolService: SchoolService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadSchools();
    this.loadClasses();
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
          detail: 'Không thể tải danh sách trường học'
        });
      }
    });
  }

  loadClasses() {
    this.loading = true;
    this.classService.getAllClasses().subscribe({
      next: (response: BaseResponse<ClassResponse[]>) => {
        this.classes = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách lớp học'
        });
        this.loading = false;
      }
    });
  }

  loadClassesBySchool() {
    if (!this.selectedSchool) {
      this.loadClasses();
      return;
    }

    this.loading = true;
    this.classService.getClassesBySchool(this.selectedSchool).subscribe({
      next: (response: ApiResponse<ClassResponse[]>) => {
        this.classes = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách lớp học theo trường'
        });
        this.loading = false;
      }
    });
  }

  onSchoolChange() {
    // Reset khối đã chọn khi thay đổi trường
    this.selectedGrade = null;
    this.loadClassesBySchool();
  }

  onGradeChange() {
    // Không cần reload data, chỉ filter qua get filteredClasses
  }

  clearFilters() {
    this.selectedSchool = '';
    this.selectedGrade = null;
    this.searchValue = '';
    this.loadClasses();
  }

  createClass() {
    this.router.navigate(['/classes/create']);
  }

  editClass(classItem: ClassResponse) {
    this.router.navigate(['/classes/edit', classItem.id]);
  }

  viewClass(classItem: ClassResponse) {
    this.router.navigate(['/classes/view', classItem.id]);
  }

  deleteClass(classItem: ClassResponse) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa lớp "${classItem.name}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.classService.deleteClass(classItem.id).subscribe({
          next: (response: BaseResponse<any>) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa lớp học thành công',
              life: 4000
            });
            this.loadClasses();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể xóa lớp học',
              life: 5000
            });
          }
        });
      }
    });
  }

  getSchoolName(schoolCode: string): string {
    const school = this.schools.find(s => s.schoolCode === schoolCode);
    return school ? school.schoolName : schoolCode;
  }

  get filteredClasses() {
    let filtered = this.classes;

    // Filter by search value
    if (this.searchValue) {
      filtered = filtered.filter(classItem => 
        classItem.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        classItem.classCode.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        this.getSchoolName(classItem.schoolCode).toLowerCase().includes(this.searchValue.toLowerCase())
      );
    }

    // Filter by grade
    if (this.selectedGrade !== null) {
      filtered = filtered.filter(classItem => classItem.grade === this.selectedGrade);
    }

    return filtered;
  }
}