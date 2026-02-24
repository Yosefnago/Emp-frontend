export interface SalaryDetails {
    id: number;
    totalSeekDays: number;
    totalVacationDays: number;
    salaryPerHour: number;
    seniority: number;
    creditPoints: number;
    pensionFund?: string;
    insuranceCompany?: string;
    providentFund?: string;
}

export interface UpdateSalaryDetailsRequest {
    personalId: string;
    totalSeekDays: number;
    totalVacationDays: number;
    salaryPerHour: number;
    seniority: number;
    creditPoints: number;
    pensionFund?: string;
    insuranceCompany?: string;
    providentFund?: string;
}
