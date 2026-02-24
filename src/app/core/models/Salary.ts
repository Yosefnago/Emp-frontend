export interface Salary {
    id: number;
    salaryAmount: number;
    salaryMonth: number;
    salaryYear: number;
    paymentDate: string; // ISO date string or Date
    pathOfTlush: string;
    createdAt: string; // ISO timestamp
}
