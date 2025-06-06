export interface Class {
  id?: string;
  name: string;
  grade: number;
  classCode?: string;
  schoolCode: string;
}

export interface ClassRequest {
  name: string;
  grade: number;
  schoolCode: string;
}

export interface ClassUpdateRequest {
  name: string;
  grade: number;
  classCode: string;
  schoolCode: string;
}

export interface ClassResponse {
  id: string;
  name: string;
  grade: number;
  classCode: string;
  schoolCode: string;
}