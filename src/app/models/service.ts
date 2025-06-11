export interface ServiceRequest {
  tenDichVu: string;
  moTa: string;
  giaTien: number;
  deliveryTime: number;
}

export interface ServiceUpdateRequest extends ServiceRequest {
}

export interface ServiceResponse {
  id: string;
  tenDichVu: string;
  moTa: string;
  giaTien: number;
  deliveryTime: number;
  createdAt: string;
  updatedAt: string;
}

// For compatibility with existing UI components
export interface ServiceDisplayModel {
  id: string;
  serviceCode?: string; 
  serviceName: string;
  serviceDescription: string;
  price: number;
  duration: number;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}