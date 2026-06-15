import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(3, "Enter your employee ID or official email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["Employee", "Manager"]),
  rememberMe: z.boolean(),
});

export const employeeInfoSchema = z.object({
  employeeId: z.string().min(4, "Employee ID is required."),
  fullName: z.string().min(2, "Full name is required."),
  designation: z.string().min(2, "Designation is required."),
  department: z.string().min(2, "Department is required."),
  reportingManager: z.string().min(2, "Reporting manager is required."),
  officialEmail: z.string().email("Use a valid official email."),
  mobileNumber: z.string().min(10, "Mobile number must include 10 digits."),
});

export const securitySchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  otp: z.string().length(6, "Enter the 6 digit OTP."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type EmployeeInfoValues = z.infer<typeof employeeInfoSchema>;
export type SecurityValues = z.infer<typeof securitySchema>;
export type OtpValues = z.infer<typeof otpSchema>;
