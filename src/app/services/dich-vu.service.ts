import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse, ApiResponse } from '../models/base-response';
import { ServiceRequest, ServiceResponse } from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class DichVuService { // Thay đổi từ ServiceService sang DichVuService
  private apiUrl = `${environment.api}/api/dich-vu`;

  constructor(private http: HttpClient) { }

  getAllServices(keyword?: string, pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<ServiceResponse[]>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (keyword && keyword.trim() !== '') {
      params = params.set('keyword', keyword.trim());
    }
    
    console.log('Getting services with params:', { keyword, pageNumber, pageSize });
    
    return this.http.get<ApiResponse<ServiceResponse[]>>(this.apiUrl, { params });
  }

  getServiceById(id: string): Observable<BaseResponse<ServiceResponse>> {
    return this.http.get<BaseResponse<ServiceResponse>>(`${this.apiUrl}/${id}`);
  }

  createService(request: ServiceRequest): Observable<BaseResponse<ServiceResponse>> {
    return this.http.post<BaseResponse<ServiceResponse>>(`${this.apiUrl}`, request);
  }

  updateService(id: string, request: ServiceRequest): Observable<BaseResponse<ServiceResponse>> {
    return this.http.put<BaseResponse<ServiceResponse>>(`${this.apiUrl}/${id}`, request);
  }

  deleteService(id: string): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.apiUrl}/${id}`);
  }

  deleteMultipleServices(ids: string[]): Observable<BaseResponse<{failedIds: string[]}>> {
    return this.http.delete<BaseResponse<{failedIds: string[]}>>(`${this.apiUrl}`, { body: ids });
  }

  searchServicesByName(name: string, pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<ServiceResponse[]>> {
    return this.getAllServices(name, pageNumber, pageSize);
  }

  getServicesWithPagination(pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<ServiceResponse[]>> {
    return this.getAllServices(undefined, pageNumber, pageSize);
  }
}