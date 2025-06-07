import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  constructor(private messageService: MessageService) {}

  handleError(error: any, operation: string = 'thao tác'): void {
    console.error(`Error occurred during ${operation}:`, error);
    
    let errorMessage = `Lỗi khi thực hiện ${operation}`;
    let errorDetail = 'Vui lòng thử lại sau';
    
    if (error instanceof HttpErrorResponse) {
      
      switch (error.status) {
        case 400:
          errorMessage = `Lỗi 400: Dữ liệu không hợp lệ`;
          errorDetail = this.extractErrorMessage(error) || 'Vui lòng kiểm tra lại thông tin đã nhập';
          break;
        case 401:
          errorMessage = `Lỗi 401: Không có quyền truy cập`;
          errorDetail = 'Vui lòng đăng nhập lại';
          break;
        case 403:
          errorMessage = `Lỗi 403: Truy cập bị từ chối`;
          errorDetail = 'Bạn không có quyền thực hiện thao tác này';
          break;
        case 404:
          errorMessage = `Lỗi 404: Không tìm thấy dữ liệu`;
          errorDetail = 'Dữ liệu có thể đã bị xóa hoặc không tồn tại';
          break;
        case 409:
          errorMessage = `Lỗi 409: Dữ liệu đã tồn tại`;
          errorDetail = this.extractErrorMessage(error) || 'Dữ liệu bị trùng lặp';
          break;
        case 422:
          errorMessage = `Lỗi 422: Dữ liệu không hợp lệ`;
          errorDetail = this.extractErrorMessage(error) || 'Vui lòng kiểm tra lại thông tin';
          break;
        case 500:
          errorMessage = `Lỗi 500: Lỗi hệ thống`;
          errorDetail = 'Đã xảy ra lỗi trên máy chủ, vui lòng thử lại sau';
          break;
        case 0:
          errorMessage = `Lỗi kết nối`;
          errorDetail = 'Không thể kết nối đến máy chủ, vui lòng kiểm tra kết nối mạng';
          break;
        default:
          errorMessage = `Lỗi HTTP ${error.status}`;
          errorDetail = this.extractErrorMessage(error) || error.message || 'Lỗi không xác định';
      }
    } else if (error?.error) {
      errorMessage = error.error.message || errorMessage;
      errorDetail = error.error.details || errorDetail;
    } else if (typeof error === 'string') {
      errorDetail = error;
    }

    this.messageService.add({
      severity: 'error',
      summary: errorMessage,
      detail: errorDetail,
      life: 7000 
    });
  }

  private extractErrorMessage(error: HttpErrorResponse): string | null {
    if (error.error) {
      
      if (typeof error.error === 'string') {
        return error.error;
      }
      
      if (error.error.message) {
        return error.error.message;
      }
      
      if (error.error.error) {
        return error.error.error;
      }
      
      if (error.error.details) {
        return error.error.details;
      }
      
      if (error.error.errors && Array.isArray(error.error.errors)) {
        return error.error.errors.join(', ');
      }
    }
    
    return error.message || null;
  }

  handleSuccess(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'success',
      summary: message,
      detail: detail || 'Thao tác đã được thực hiện thành công',
      life: 4000
    });
  }

  handleWarning(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: message,
      detail: detail || '',
      life: 4000
    });
  }

  handleInfo(message: string, detail?: string): void {
    this.messageService.add({
      severity: 'info',
      summary: message,
      detail: detail || '',
      life: 3000
    });
  }
}