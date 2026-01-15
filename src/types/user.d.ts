import { ApiResponse } from "./generic";

export type UserRole = "super_admin" | "admin";

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
