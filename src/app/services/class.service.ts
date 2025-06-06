import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse, ApiResponse } from '../models/base-response';
import { ClassRequest, ClassUpdateRequest, ClassResponse } from '../models/class';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private apiUrl = `${environment.api}/api/classes`;

  constructor(private http: HttpClient) { }

  createClass(classData: ClassRequest): Observable<BaseResponse<ClassResponse>> {
    return this.http.post<BaseResponse<ClassResponse>>(this.apiUrl, classData);
  }

  getAllClasses(): Observable<BaseResponse<ClassResponse[]>> {
    return this.http.get<BaseResponse<ClassResponse[]>>(this.apiUrl);
  }

  getClassById(id: string): Observable<BaseResponse<ClassResponse>> {
    return this.http.get<BaseResponse<ClassResponse>>(`${this.apiUrl}/${id}`);
  }

  updateClass(id: string, classData: ClassUpdateRequest): Observable<BaseResponse<ClassResponse>> {
    return this.http.put<BaseResponse<ClassResponse>>(`${this.apiUrl}/${id}`, classData);
  }

  deleteClass(id: string): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.apiUrl}/${id}`);
  }

  getClassesBySchool(schoolCode: string): Observable<ApiResponse<ClassResponse[]>> {
    return this.http.get<ApiResponse<ClassResponse[]>>(`${this.apiUrl}/by-school/${schoolCode}`);
  }
}