export interface SearchQuery {
  year: string;
  month: string;
  department: string;
  employeeName: string;
}

export interface EmployeeOption {
  name: string;
  department: string;
}

export interface AttendanceRecord {
  personalId: string;
  date: string;
  employeeName: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  notes: string;
  travelAllowance: boolean;
}