export interface School {
  id?: string;
  schoolName: string;
  schoolAddress: string;
  schoolCode?: string;
}

export interface SchoolRequest {
  schoolName: string;
  schoolAddress: string;
}

export interface SchoolUpdateRequest {
  schoolName: string;
  schoolAddress: string;
  schoolCode: string;
}

export interface SchoolResponse {
  id: string;
  schoolName: string;
  schoolAddress: string;
  schoolCode: string;
}