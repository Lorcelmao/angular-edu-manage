import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse, ApiResponse } from '../models/base-response';
import { StudentRequest, StudentResponse, StudentCountByClass } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.api}/api/students`;

  constructor(private http: HttpClient) { }

  createStudent(student: StudentRequest): Observable<BaseResponse<StudentResponse>> {
    return this.http.post<BaseResponse<StudentResponse>>(this.apiUrl, student);
  }

  getAllStudents(): Observable<BaseResponse<StudentResponse[]>> {
    return this.http.get<BaseResponse<StudentResponse[]>>(this.apiUrl);
  }

  getStudentById(id: string): Observable<BaseResponse<StudentResponse>> {
    return this.http.get<BaseResponse<StudentResponse>>(`${this.apiUrl}/${id}`);
  }

  updateStudent(id: string, student: StudentRequest): Observable<BaseResponse<StudentResponse>> {
    return this.http.put<BaseResponse<StudentResponse>>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.apiUrl}/${id}`);
  }

  getStudentsByClass(classCode: string): Observable<BaseResponse<StudentResponse[]>> {
    return this.http.get<BaseResponse<StudentResponse[]>>(`${this.apiUrl}/by-class/${classCode}`);
  }

  getStudentsPagination(schoolCode?: string, classCode?: string, page?: number, size?: number): Observable<ApiResponse<StudentResponse[]>> {
    let params = new HttpParams();
    if (schoolCode) params = params.set('schoolCode', schoolCode);
    if (classCode) params = params.set('classCode', classCode);
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<ApiResponse<StudentResponse[]>>(`${this.apiUrl}/pagination-list`, { params });
  }

  searchStudentsByName(name: string, page?: number, size?: number): Observable<ApiResponse<StudentResponse[]>> {
    let params = new HttpParams().set('name', name);
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<ApiResponse<StudentResponse[]>>(`${this.apiUrl}/search`, { params });
  }

  getStudentCountByClass(): Observable<BaseResponse<StudentCountByClass[]>> {
    return this.http.get<BaseResponse<StudentCountByClass[]>>(`${this.apiUrl}/count-by-class`);
  }
}