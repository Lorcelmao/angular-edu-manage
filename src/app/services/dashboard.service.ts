import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../models/base-response';
import { SchoolResponse } from '../models/school';
import { ClassResponse } from '../models/class';
import { StudentResponse } from '../models/student';

export interface DashboardStats {
  totalSchools: number;
  totalClasses: number;
  totalStudents: number;
  averageStudentsPerClass: number;
}

export interface SchoolClassCount {
  schoolName: string;
  schoolCode: string;
  classCount: number;
}

export interface GradeDistribution {
  grade: number;
  classCount: number;
  studentCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private schoolsUrl = `${environment.api}/api/schools`;
  private classesUrl = `${environment.api}/api/classes`;
  private studentsUrl = `${environment.api}/api/students`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      schools: this.http.get<BaseResponse<SchoolResponse[]>>(`${this.schoolsUrl}`),
      classes: this.http.get<BaseResponse<ClassResponse[]>>(`${this.classesUrl}`),
      students: this.http.get<BaseResponse<StudentResponse[]>>(`${this.studentsUrl}`)
    }).pipe(
      map(({ schools, classes, students }) => {
        const totalSchools = schools.data.length;
        const totalClasses = classes.data.length;
        const totalStudents = students.data.length;
        const averageStudentsPerClass = totalClasses > 0 ? totalStudents / totalClasses : 0;

        return {
          totalSchools,
          totalClasses,
          totalStudents,
          averageStudentsPerClass
        };
      })
    );
  }

  getSchoolClassCounts(): Observable<SchoolClassCount[]> {
    return forkJoin({
      schools: this.http.get<BaseResponse<SchoolResponse[]>>(`${this.schoolsUrl}`),
      classes: this.http.get<BaseResponse<ClassResponse[]>>(`${this.classesUrl}`)
    }).pipe(
      map(({ schools, classes }) => {
        const schoolClassMap = new Map<string, { schoolName: string; classCount: number }>();
        
        
        schools.data.forEach(school => {
          schoolClassMap.set(school.schoolCode, {
            schoolName: school.schoolName,
            classCount: 0
          });
        });

        
        classes.data.forEach(classItem => {
          const schoolData = schoolClassMap.get(classItem.schoolCode);
          if (schoolData) {
            schoolData.classCount++;
          }
        });

        
        return Array.from(schoolClassMap.entries())
          .map(([schoolCode, data]) => ({
            schoolCode,
            schoolName: data.schoolName,
            classCount: data.classCount
          }))
          .sort((a, b) => b.classCount - a.classCount);
      })
    );
  }

  getGradeDistribution(): Observable<GradeDistribution[]> {
    return forkJoin({
      classes: this.http.get<BaseResponse<ClassResponse[]>>(`${this.classesUrl}`),
      students: this.http.get<BaseResponse<StudentResponse[]>>(`${this.studentsUrl}`)
    }).pipe(
      map(({ classes, students }) => {
        const gradeMap = new Map<number, { classCount: number; studentCount: number }>();

        
        classes.data.forEach(classItem => {
          const grade = classItem.grade;
          if (!gradeMap.has(grade)) {
            gradeMap.set(grade, { classCount: 0, studentCount: 0 });
          }
          gradeMap.get(grade)!.classCount++;
        });

        
        students.data.forEach(student => {
          const studentClass = classes.data.find(c => c.classCode === student.classCode);
          if (studentClass) {
            const grade = studentClass.grade;
            if (gradeMap.has(grade)) {
              gradeMap.get(grade)!.studentCount++;
            }
          }
        });

        
        return Array.from(gradeMap.entries())
          .map(([grade, data]) => ({
            grade,
            classCount: data.classCount,
            studentCount: data.studentCount
          }))
          .sort((a, b) => a.grade - b.grade);
      })
    );
  }
}