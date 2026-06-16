export interface SignupEmployeeInfo {
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  reportingManager: string;
  officialEmail: string;
  mobileNumber?: string;
}

export interface SignupSecurityInfo {
  password: string;
  confirmPassword: string;
}

export interface SignupState {
  employee: SignupEmployeeInfo;
  security: SignupSecurityInfo;
  otp: string;
}

export interface AuthSession {
  employeeId: string;
  name: string;
  email: string;
  reportingManager: string;
  reportingManagerEmail: string;
  role: "employee" | "manager";
}
