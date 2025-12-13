import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './signIn/signIn';
import {EmployeesComponent} from './employee/employees-dashboard/employee';
import {EventsComponent} from './events/events';
import {HomeComponent} from './home/home';
import {SalaryComponent} from './salary/salary';
import {AddEmployeeComponent} from './employee/add-employee/addemployee';
import {EmployeeDetailsComponent} from './employee/employee-details/employeeDetailsComponent';
import { EmployeeSalaryComponent } from './employee/employee-salary/employee-salary.component';
import { EmployeeDocumentComponent } from './employee/employee-document/employee-document.component';
import { ErrorComponent } from './error/error.component';
import { EmployeeAttendence } from './employee/employee-attendence/employee-attendence';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent } ,
  { path: 'error', component: ErrorComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'employees', component: EmployeesComponent },
      { path: 'events', component: EventsComponent },
      { path: 'salaries', component: SalaryComponent },
      { path: 'home', component: HomeComponent },
      { path: 'add', component: AddEmployeeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'employeeDetails/:personalId', component: EmployeeDetailsComponent },
      { path: 'salary/:personalId', component: EmployeeSalaryComponent},
      { path: 'document/:personalId', component: EmployeeDocumentComponent},
      { path: 'attendence/:personalId', component: EmployeeAttendence}

    ]
  }

];
