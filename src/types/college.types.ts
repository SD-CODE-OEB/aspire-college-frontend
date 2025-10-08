// Core entities
export interface College {
  collegeId: number;
  collegeName: string;
  location: string;
  createdAt?: string;
}

export interface Course {
  courseId: number;
  courseName: string;
  fee: string; // Decimal from database comes as string
  collegeId: number;
  createdAt?: string;
}

// Combined data structure for GET /api/colleges/ response
export interface CollegeCourseItem {
  collegeId: number;
  collegeName: string;
  location: string;
  course: string;
  fee: string;
}

// API Request types
export interface CreateCollegeRequest {
  collegeName: string;
  location: string;
  courses?: Array<{
    courseName: string;
    fee: string | number;
  }>;
}

export interface AddCourseRequest {
  collegeId: number;
  courseName: string;
  fee: string | number;
}

// API Response types
export interface CollegesOnlyResponse {
  data: College[];
  message: string;
  status: string;
}

export interface CollegesWithCoursesResponse {
  data: CollegeCourseItem[];
  message: string;
  status: string;
}

export interface CreateCollegeResponse {
  data: College & {
    courses?: Array<{ courseName: string; fee: number }>;
  };
  message: string;
  status: string;
}

export interface AddCourseResponse {
  data: Course;
  message: string;
  status: string;
}
