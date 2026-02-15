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
  attendanceClosed: boolean; 
}
export interface AttendanceSummary {
  personalId: string;
  year: string;
  month: string;
  department: string;
  employeeName: string;
}