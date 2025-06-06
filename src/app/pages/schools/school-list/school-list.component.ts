import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SchoolService } from '../../../services/school.service';
import { SchoolResponse } from '../../../models/school';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.scss']
})
export class SchoolListComponent implements OnInit {
  schools: SchoolResponse[] = [];
  loading: boolean = false;
  searchValue: string = '';

  constructor(
    private schoolService: SchoolService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loadSchools();
  }

  loadSchools() {
    this.loading = true;
    this.schoolService.getAllSchools().subscribe({
      next: (response) => {
        this.schools = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Lỗi',
          detail: 'Không thể tải danh sách trường học'
        });
        this.loading = false;
      }
    });
  }

  createSchool() {
    this.router.navigate(['/schools/create']);
  }

  editSchool(school: SchoolResponse) {
    this.router.navigate(['/schools/edit', school.id]);
  }

  viewSchool(school: SchoolResponse) {
    this.router.navigate(['/schools/view', school.id]);
  }

  deleteSchool(school: SchoolResponse) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa trường "${school.schoolName}"?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.schoolService.deleteSchool(school.id).subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Xóa trường học thành công',
            });
            this.loadSchools();
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Lỗi',
              detail: 'Không thể xóa trường học'
            });
          }
        });
      }
    });
  }

  get filteredSchools() {
    if (!this.searchValue) {
      return this.schools;
    }
    return this.schools.filter(school => 
      school.schoolName.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      school.schoolAddress.toLowerCase().includes(this.searchValue.toLowerCase()) ||
      school.schoolCode.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }
}