export interface College {
  collegeId: number;
  collegeName: string;
  location: string;
  course: string;
  fee: string;
}

export interface CollegesResponse {
  data: College[];
  message: string;
  status: string;
}
