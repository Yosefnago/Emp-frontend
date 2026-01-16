export interface Employee {
  id: number;
  name: string;
  idNumber: string;
  email: string;
  phoneNumber: string;
  department: string;
  attendanceStatus: 'present' | 'absent' | 'late' | 'vacation';
  selected?: boolean;
}

export interface AddEmployeeRequest {
    firstName: string,
    lastName: string,
    personalId: string,
    email: string,
    phone: string,
    address: string,
    position: string,
    department: string,
    hireDate: Date
    status: string
}

export interface UpdateEmployeeRequest {
    firstName: string;
    lastName: string;
    email: string;
    personalId: string;
    gender: string;
    birthDate: string;
    familyStatus: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    position: string;
    department: string;
    hireDate: string;
    jobType: string;
    status: string;
}