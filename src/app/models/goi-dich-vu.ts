export interface GoiDichVuRequest {
  tenGoi: string;
  moTa: string;
  giaGoi: number;
  phuongThucThanhToan?: string;
  chiPhiPhatSinh?: string;
}

export interface GoiDichVuUpdateRequest {
  tenGoi: string;
  moTa: string;
  giaGoi: number;
  phuongThucThanhToan?: string;
  chiPhiPhatSinh?: string;
}

export interface GoiDichVuResponse {
  id: string;
  tenGoi: string;
  moTa: string;
  giaGoi: number;
  phuongThucThanhToan?: string;
  chiPhiPhatSinh?: string;
  tongThoiGianCungCapDichVu?: number;
  createdAt: string;
  updatedAt: string;
  dichvuchinh: ServiceItem[];
  dichvuthem: ServiceItem[];
  noiDungDacDiem: ServiceItem[];
}

export interface ServiceItem {
  id: string;
  tenDichVu: string;
  moTa: string;
  giaTien: number;
  deliveryTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface GoiDichVuDichVuRequest {
  goiDichVuId: string;
  dichVuId: string;
  loaiDichVu: 'dichvuchinh' | 'dichvuthem' | 'noiDungDacDiem';
}

export interface GoiDichVuDichVuResponse {
  status: number;
  message: string;
  data: any;
}