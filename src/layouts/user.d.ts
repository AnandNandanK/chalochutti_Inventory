import { ApiResponse } from "./generic";

export type UserRole = "super_admin" | "teacher" | "student" | "school_admin";

interface StudentProfileType {
  fullName: string;
  loginId: string;
  role: string;
  hasDefaultPasswordChanged: boolean;
  student?: {
    studentEmail: string;
    studentEnrollment: string;
  };
}

export type StudentProfileResponse = ApiResponse<StudentProfileType>;
