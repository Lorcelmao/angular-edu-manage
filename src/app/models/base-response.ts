export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  pageNumber: number;
  pageSize: number;
  countItems: number;
  countPages: number;
  data: T;
}