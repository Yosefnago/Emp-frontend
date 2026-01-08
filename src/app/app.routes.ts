import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './signIn/signIn';
import { EventsComponent } from './events/events';
import { HomeComponent } from './home/home';
import { DashboardComponent } from './dashboard/dashboard.component'; // ✅ הוסף את זה!
import { SalaryComponent } from './salary/salary';
import { ErrorComponent } from './error/error.component';
import { EmployeesComponent } from './employees/employees';
import { DepartmentsComponent } from './departments/departments';
import { AttendanceComponent } from './attendence/attendence';
import { ProjectsComponent } from './projects/projects';
import { ReportsComponent } from './reports/reports';
import { SettingsComponent } from './settings/settings';

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
      { path: 'departments', component: DepartmentsComponent },
      { path: 'attendance', component: AttendanceComponent },
      { path: 'salary', component: SalaryComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'events', component: EventsComponent },
    ]
  },
  { path: '**', redirectTo: 'error' }
];