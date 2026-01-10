import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './signIn/signIn';
import { HomeComponent } from './home/home';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { ErrorComponent } from './error/error.component';
import { EmployeesComponent } from './employees/employees';
import { EmployeeDetailsComponent } from './employees/empployee-details/employee-details.component';
import { DepartmentComponent } from './departments/department.component';
import { AttendanceComponent } from './attendence/attendance.component';
import { SalaryComponent } from './salary/salary.component';
import { EventsComponent } from './events/events.component';
import { ReportsComponent } from './reports/reports.component';
import { SettingsComponent } from './settings/settings.component';

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
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'events', component: EventsComponent },
      { path: 'employees/details', component: EmployeeDetailsComponent }
    ]
  },
  { path: '**', redirectTo: 'error' }
];