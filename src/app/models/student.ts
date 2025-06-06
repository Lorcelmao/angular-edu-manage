export interface Student {
  id?: string;
  name: string;
  birthday: Date;
  classCode: string;
}

export interface StudentRequest {
  name: string;
  birthday: string;
  classCode: string;
}

export interface StudentResponse {
  id: string;
  name: string;
  birthday: any;
  classCode: string;
}

export interface StudentCountByClass {
  classCode: string;
  count: number;
}