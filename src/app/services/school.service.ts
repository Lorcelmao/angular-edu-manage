import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../models/base-response';
import { School, SchoolRequest, SchoolUpdateRequest, SchoolResponse } from '../models/school';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private apiUrl = `${environment.api}/api/schools`;

  constructor(private http: HttpClient) { }

  createSchool(school: SchoolRequest): Observable<BaseResponse<SchoolResponse>> {
    return this.http.post<BaseResponse<SchoolResponse>>(this.apiUrl, school);
  }

  getAllSchools(): Observable<BaseResponse<SchoolResponse[]>> {
    return this.http.get<BaseResponse<SchoolResponse[]>>(this.apiUrl);
  }

  getSchoolById(id: string): Observable<BaseResponse<SchoolResponse>> {
    return this.http.get<BaseResponse<SchoolResponse>>(`${this.apiUrl}/${id}`);
  }

  updateSchool(id: string, school: SchoolUpdateRequest): Observable<BaseResponse<SchoolResponse>> {
    return this.http.put<BaseResponse<SchoolResponse>>(`${this.apiUrl}/${id}`, school);
  }

  deleteSchool(id: string): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.apiUrl}/${id}`);
  }

  getSchoolsWithMoreThanNClasses(number: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/with-more-than/${number}-classes`);
  }
}