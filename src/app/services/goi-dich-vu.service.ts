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

  // Lấy tất cả gói dịch vụ
  // getAllGoiDichVu(): Observable<BaseResponse<GoiDichVuResponse[]>> {
  //   return this.http.get<BaseResponse<GoiDichVuResponse[]>>(this.apiUrl);
  // }
  getAllGoiDichVu(keyword?: string, pageNumber: number = 1, pageSize: number = 10): Observable<ApiResponse<GoiDichVuResponse[]>> {
    // Xây dựng tham số truy vấn
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    
    if (keyword && keyword.trim() !== '') {
      params = params.set('keyword', keyword.trim());
    }
    
    console.log('Đang lấy gói dịch vụ với tham số:', { keyword, pageNumber, pageSize });
    
      return this.http.get<ApiResponse<GoiDichVuResponse[]>>(this.apiUrl, { params });
  }

  // Lấy chi tiết gói dịch vụ theo ID
  getGoiDichVuById(id: string): Observable<BaseResponse<GoiDichVuResponse>> {
    return this.http.get<BaseResponse<GoiDichVuResponse>>(`${this.apiUrl}/${id}`);
  }

  // Tạo gói dịch vụ mới
  createGoiDichVu(goiDichVu: GoiDichVuRequest): Observable<BaseResponse<GoiDichVuResponse>> {
    return this.http.post<BaseResponse<GoiDichVuResponse>>(this.apiUrl, goiDichVu);
  }

  // Cập nhật gói dịch vụ
  updateGoiDichVu(id: string, goiDichVu: GoiDichVuUpdateRequest): Observable<BaseResponse<GoiDichVuResponse>> {
    return this.http.put<BaseResponse<GoiDichVuResponse>>(`${this.apiUrl}/${id}`, goiDichVu);
  }

  // Xóa gói dịch vụ
  deleteGoiDichVu(id: string): Observable<BaseResponse<any>> {
    return this.http.delete<BaseResponse<any>>(`${this.apiUrl}/${id}`);
  }

  // Lấy tất cả dịch vụ
  getAllServices(): Observable<BaseResponse<ServiceResponse[]>> {
    return this.http.get<BaseResponse<ServiceResponse[]>>(this.apiUrlDichVu);
  }

  // Lấy danh sách dịch vụ trong gói dịch vụ
  // Since the API already returns services with the package, we'll just extract them
  getServicesByPackageId(id: string): Observable<BaseResponse<ServiceResponse[]>> {
    return this.getGoiDichVuById(id).pipe(
      map(response => {
        if (!response || !response.data) {
          return { code: 0, message: 'No data', data: [] };
        }
        
        // Combine only dichvuchinh and dichvuthem, excluding noiDungDacDiem
        const allServices = [
          ...(response.data.dichvuchinh || []),
          ...(response.data.dichvuthem || [])
          // Removed noiDungDacDiem
        ];
        
        return {
          code: response.code,
          message: response.message,
          data: allServices
        };
      })
    );
  }

  // Lấy danh sách dịch vụ chưa thêm vào gói dịch vụ
  getServicesNotInPackage(id: string): Observable<BaseResponse<ServiceResponse[]>> {
    // First, get all services
    return this.getAllServices().pipe(
      // Then get services in the package and filter them out
      switchMap(allServicesResponse => {
        return this.getGoiDichVuById(id).pipe(
          map(packageResponse => {
            if (!packageResponse || !packageResponse.data) {
              return allServicesResponse;
            }
            
            const packageServices = [
              ...(packageResponse.data.dichvuchinh || []),
              ...(packageResponse.data.dichvuthem || []),
              ...(packageResponse.data.noiDungDacDiem || [])
            ];
            
            const packageServiceIds = packageServices.map(s => s.id);
            
            const availableServices = allServicesResponse.data.filter(
              service => !packageServiceIds.includes(service.id)
            );
            
            return {
              code: allServicesResponse.code,
              message: allServicesResponse.message,
              data: availableServices
            };
          })
        );
      })
    );
  }

  // Add service to package with specified type
  // addServiceToPackage(packageId: string, serviceId: string, serviceType: 'dichvuchinh' | 'dichvuthem' = 'dichvuchinh'): Observable<BaseResponse<any>> {
  //   // Tạo payload đúng theo API documentation - chỉ gồm goiDichVuId và dichVuId
  //   const body = {
  //     goiDichVuId: packageId,
  //     dichVuId: serviceId
  //     // Không thêm loaiDichVu vì API không hỗ trợ trường này
  //   };
    
  //   console.log('Sending request to add service to package:', {
  //     endpoint: this.apiUrlRelation,
  //     body
  //   });
    
  //   return this.http.post<BaseResponse<any>>(this.apiUrlRelation, body);
  // }
  addServiceToPackage(packageId: string, serviceId: string): Observable<BaseResponse<any>> {
    // Chỉ gửi các trường API yêu cầu
    const body = {
      goiDichVuId: packageId,
      dichVuId: serviceId
      // Không thêm loaiDichVu vào body
    };
    
    console.log('Sending request to add service to package:', {
      endpoint: this.apiUrlRelation,
      body
    });
    
    return this.http.post<BaseResponse<any>>(this.apiUrlRelation, body);
  }

  // Remove service from package
  removeServiceFromPackage(packageId: string, serviceId: string, serviceType?: string): Observable<BaseResponse<any>> {
    // Vì API doc không chỉ rõ endpoint xóa, chúng ta sẽ dùng cách tiếp cận khác
    // Thường sẽ là DELETE với params hoặc endpoint cụ thể
    
    // Phương án 1: Dùng query params
    let params = new HttpParams()
      .set('goiDichVuId', packageId)
      .set('dichVuId', serviceId);
      
    if (serviceType) {
      params = params.set('loaiDichVu', serviceType);
    }
    
    return this.http.delete<BaseResponse<any>>(`${this.apiUrlRelation}`, { params });
    
    // Phương án 2 (dự phòng): Nếu API cần endpoint kiểu RESTful
    // const endpoint = `${this.apiUrlRelation}/${packageId}/${serviceId}`;
    // return this.http.delete<BaseResponse<any>>(endpoint);
  }
}