import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BaseResponse, ApiResponse } from '../models/base-response';
import { GoiDichVuRequest, GoiDichVuResponse, GoiDichVuUpdateRequest, GoiDichVuDichVuRequest, GoiDichVuDichVuResponse, ServiceItem } from '../models/goi-dich-vu';
import { ServiceResponse } from '../models/service';

@Injectable({
  providedIn: 'root'
})
export class GoiDichVuService {
  private apiUrl = `${environment.api}/api/goi-dich-vu`;
  private apiUrlDichVu = `${environment.api}/api/dich-vu`;
  private apiUrlRelation = `${environment.api}/api/goi-dich-vu-dich-vu`;

  constructor(private http: HttpClient) {}

  getAllGoiDichVu(keyword?: string, pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<GoiDichVuResponse[]>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (keyword && keyword.trim() !== '') {
      params = params.set('keyword', keyword.trim());
    }
    
    console.log('Đang lấy gói dịch vụ với tham số:', { keyword, pageNumber, pageSize });
    
      return this.http.get<ApiResponse<GoiDichVuResponse[]>>(this.apiUrl, { params });
  }

  
  getGoiDichVuById(id: string): Observable<BaseResponse<GoiDichVuResponse>> {
    return this.http.get<BaseResponse<GoiDichVuResponse>>(`${this.apiUrl}/${id}`);
  }

  
  createGoiDichVu(goiDichVu: GoiDichVuRequest): Observable<BaseResponse<GoiDichVuResponse>> {
    return this.http.post<BaseResponse<GoiDichVuResponse>>(this.apiUrl, goiDichVu);
  }

  
  updateGoiDichVu(id: string, goiDichVu: GoiDichVuUpdateRequest): Observable<BaseResponse<GoiDichVuResponse>> {
    return this.http.put<BaseResponse<GoiDichVuResponse>>(`${this.apiUrl}/${id}`, goiDichVu);
  }

  
  deleteGoiDichVu(id: string): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.apiUrl}/${id}`);
  }

  
  getAllServices(): Observable<BaseResponse<ServiceResponse[]>> {
    return this.http.get<BaseResponse<ServiceResponse[]>>(this.apiUrlDichVu);
  }

  
  
  getServicesByPackageId(id: string): Observable<BaseResponse<ServiceResponse[]>> {
    return this.getGoiDichVuById(id).pipe(
      map(response => {
        if (!response || !response.data) {
          return { code: 0, message: 'No data', data: [] };
        }
  
        const allServices = [
          ...(response.data.dichvuchinh || []),
          ...(response.data.dichvuthem || [])
          
        ];
        
        return {
          code: response.code,
          message: response.message,
          data: allServices
        };
      })
    );
  }

  
  getServicesNotInPackage(id: string): Observable<BaseResponse<ServiceResponse[]>> {
    const url = `${environment.api}/api/goi-dich-vu-dich-vu/goi-dich-vu-chua-them`;
    let params = new HttpParams().set('id', id);
    
    console.log('Lấy danh sách dịch vụ chưa thêm vào gói:', { id, url });
    
    return this.http.get<BaseResponse<ServiceResponse[]>>(url, { params });
  }

  
  
  
  
  
  
  
  
    
  
  
  
  
    
  
  
  addServiceToPackage(packageId: string, serviceId: string): Observable<BaseResponse<any>> {
    
    const body = {
      goiDichVuId: packageId,
      dichVuId: serviceId
      
    };
    
    console.log('Sending request to add service to package:', {
      endpoint: this.apiUrlRelation,
      body
    });
    
    return this.http.post<BaseResponse<any>>(this.apiUrlRelation, body);
  }

  
  removeServiceFromPackage(packageId: string, serviceId: string, serviceType?: string): Observable<BaseResponse<any>> {
    
    
    
    
    let params = new HttpParams()
      .set('goiDichVuId', packageId)
      .set('dichVuId', serviceId);
      
    if (serviceType) {
      params = params.set('loaiDichVu', serviceType);
    }
    
    return this.http.delete<BaseResponse<any>>(`${this.apiUrlRelation}`, { params });
    
    
    
    
  }
}