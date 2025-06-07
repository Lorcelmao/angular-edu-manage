import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, DashboardStats, SchoolClassCount, GradeDistribution } from '../../services/dashboard.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading: boolean = false;
  
  
  totalSchools: number = 0;
  totalClasses: number = 0;
  totalStudents: number = 0;
  averageStudentsPerClass: number = 0;
  
  
  schoolClassCounts: SchoolClassCount[] = [];
  gradeDistribution: GradeDistribution[] = [];
  
  
  chartOptions: any;
  gradeChartData: any;
  schoolChartData: any;

  constructor(
    private dashboardService: DashboardService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {
    this.initChartOptions();
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    
    
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats: DashboardStats) => {
        this.totalSchools = stats.totalSchools;
        this.totalClasses = stats.totalClasses;
        this.totalStudents = stats.totalStudents;
        this.averageStudentsPerClass = stats.averageStudentsPerClass;
        this.loading = false;
      },
      error: (error) => {
        this.errorHandler.handleError(error, 'tải thống kê tổng quan');
        this.loading = false;
      }
    });

    
    this.dashboardService.getSchoolClassCounts().subscribe({
      next: (data: SchoolClassCount[]) => {
        this.schoolClassCounts = data;
        this.updateSchoolChart();
      },
      error: (error) => {
        this.errorHandler.handleError(error, 'tải thống kê số lớp theo trường');
      }
    });

    
    this.dashboardService.getGradeDistribution().subscribe({
      next: (data: GradeDistribution[]) => {
        this.gradeDistribution = data;
        this.updateGradeChart();
      },
      error: (error) => {
        this.errorHandler.handleError(error, 'tải phân bố khối lớp');
      }
    });
  }

  initChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              family: 'Inter, sans-serif',
              size: 12,
              weight: '500'
            },
            color: '#64748b'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          cornerRadius: 8,
          titleFont: {
            family: 'Plus Jakarta Sans, sans-serif',
            size: 14,
            weight: '600'
          },
          bodyFont: {
            family: 'Inter, sans-serif',
            size: 13
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: '#f1f5f9'
          },
          ticks: {
            font: {
              family: 'Inter, sans-serif',
              size: 11,
              weight: '500'
            },
            color: '#64748b',
            maxRotation: 45
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: '#f1f5f9'
          },
          ticks: {
            font: {
              family: 'Inter, sans-serif',
              size: 11,
              weight: '500'
            },
            color: '#64748b',
            precision: 0
          }
        }
      }
    };
  }

  updateSchoolChart() {
    const top5Schools = this.schoolClassCounts.slice(0, 5);
    
    this.schoolChartData = {
      labels: top5Schools.map(s => s.schoolName),
      datasets: [
        {
          label: 'Số lớp',
          data: top5Schools.map(s => s.classCount),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderColor: [
            'rgb(99, 102, 241)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(139, 92, 246)'
          ],
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };
  }

  updateGradeChart() {
    this.gradeChartData = {
      labels: this.gradeDistribution.map(g => `Lớp ${g.grade}`),
      datasets: [
        {
          label: 'Số lớp',
          data: this.gradeDistribution.map(g => g.classCount),
          backgroundColor: 'rgba(99, 102, 241, 0.8)',
          borderColor: 'rgb(99, 102, 241)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Số học sinh',
          data: this.gradeDistribution.map(g => g.studentCount),
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };
  }

  
  navigateToSchools() {
    this.router.navigate(['/schools']);
  }

  navigateToClasses() {
    this.router.navigate(['/classes']);
  }

  navigateToStudents() {
    this.router.navigate(['/students']);
  }
}