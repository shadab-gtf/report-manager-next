"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeInfoSchema, type EmployeeInfoValues } from "@/modules/auth/schemas/auth-schemas";
import { StepHeading, Field, SelectField, PrimaryButton } from "./signup-components";

export function EmployeeInfoStep({
  onComplete,
}: {
  onComplete: (values: EmployeeInfoValues) => void;
}) {
  const isDev = process.env.NODE_ENV === "development";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeInfoValues>({
    resolver: zodResolver(employeeInfoSchema),
    defaultValues: isDev ? {
      employeeId: "GTF-1042",
      fullName: "Kuldeep",
      designation: "Operations Associate",
      department: "Operations",
      reportingManager: "Saurabh Yadav",
      officialEmail: "kuldeep.choudhary@gtftechnologies.com",
      mobileNumber: "9876543210",
    } : {
      employeeId: "",
      fullName: "",
      designation: "",
      department: "",
      reportingManager: "",
      officialEmail: "",
      mobileNumber: "",
    },
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onComplete)}>
      <StepHeading title="Employee information" />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Employee ID" registration={register("employeeId")} error={errors.employeeId?.message} />
        <Field label="Full name" registration={register("fullName")} error={errors.fullName?.message} />
        <SelectField label="Designation" registration={register("designation")} error={errors.designation?.message} options={["Operations Associate", "Software Engineer", "Manager", "Analyst", "Intern", "Other"]} />
        <SelectField label="Department" registration={register("department")} error={errors.department?.message} options={["Operations", "Technology", "Marketing", "Sales", "HR", "Finance", "Other"]} />
        <div className="col-span-full md:col-span-1">
          <SelectField label="Reporting manager" registration={register("reportingManager")} error={errors.reportingManager?.message} options={["Saurabh Yadav", "Priya Menon", "Vikram Singh", "Other"]} />
        </div>
        <div className="col-span-full md:col-span-1">
          <Field label="Official GTF email" registration={register("officialEmail")} error={errors.officialEmail?.message} />
        </div>
        <div className="col-span-full md:col-span-1">
          <Field label="Mobile number" registration={register("mobileNumber")} error={errors.mobileNumber?.message} />
        </div>
      </div>
      <PrimaryButton>Continue</PrimaryButton>
    </form>
  );
}
