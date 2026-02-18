import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/signIn';
import { HomeComponent } from './layout/main-layout/home';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ErrorComponent } from './features/error/error.component';
import { EmployeesComponent } from './features/employees/employees';
import { EmployeeDetailsComponent } from './features/employees/empployee-details/employee-details.component';
import { DepartmentComponent } from './features/departments/department.component';
import { AttendanceComponent } from './features/attendance/attendance.component';
import { SalaryComponent } from './features/salary/salary.component';
import { EventsComponent } from './features/events/events.component';
import { SettingsComponent } from './features/settings/settings.component';
import { AuditLogsComponent } from './features/audit/audit.logs';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'error', component: ErrorComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'departments', component: DepartmentComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'salary', component: SalaryComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'events', component: EventsComponent },
      { path: 'employees/details', component: EmployeeDetailsComponent },
      { path: 'logs', component: AuditLogsComponent }
    ]
  },
  { path: '**', redirectTo: 'error' }
];