import {Component, OnInit} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';


/**
 * Component: EmployeesComponent
 * --------------------------------------
 * This component displays a list of employees retrieved from the backend,
 * provides a search (filter) feature, supports row selection,
 * and enables navigation to the detailed employee view (on double-click or manual trigger).
 *
 * It uses Angular's standalone component model, HttpClient for REST communication,
 * and Router for navigation within the dashboard.
 */
@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, MatTableModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './employee.html',
  styleUrls: ['./employee.css']
})
export class EmployeesComponent implements OnInit {

  /** The current search term entered by the user */
  searchTerm: string = '';
  /** Column names for table rendering (future use with Angular Material table) */
  displayedColumns: string[] = ['name','personalId' ,'department', 'phone', 'email'];

  /** Full list of employees fetched from the backend */
  employees:any[]=[];
  /** Currently selected employee (on single click) */
  selectedEmployee: any = null;
  /** Filtered list of employees shown after applying search criteria */
  filteredEmployees: any[] = [];


  /**
   * Constructor
   * @param http - Angular HttpClient service for performing REST API calls
   * @param router - Angular Router service for navigation between components
   */
  constructor(private http: HttpClient,private router: Router) {}


  /**
   * Lifecycle hook — called once the component is initialized.
   * Automatically triggers employee data loading from the server.
   */
  ngOnInit() {
    this.loadEmployees();
  }

  /**
   * Loads all employees from the backend API.
   * Makes a GET request to /employees/loadAll and attaches the JWT token
   * from localStorage for authorization.
   *
   * On success: stores the full list and a filtered copy.
   * On failure: logs the error to the console.
   */
  loadEmployees() {
    this.http.get<any[]>('http://localhost:8090/employees/loadAll',{
      headers:{
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    }).subscribe({
      next: data => {
        this.employees = data;
        this.filteredEmployees = [...data];

      },
      error: err => {console.log(err);}
    })
  }

  /**
   * Applies a text-based filter across all employee fields.
   * Converts the search term to lowercase and checks if any string field
   * in the employee object includes the given term.
   */
  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    this.filteredEmployees = this.employees.filter(emp => {
      return Object.values(emp)
        .filter((v): v is string => typeof v === 'string')
        .some(v => v.toLowerCase().includes(term));
    });
  }

  /**
   * Handles single-click selection of an employee row.
   * Used for highlighting or showing contextual actions.
   * @param emp - The selected employee object
   */
  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
  }

  /**
   * Navigates to the Employee Details page for the given employee ID.
   * @param id - Unique employee identifier
   */
  goToEmployeeDetails(personalId: string) {
    this.router.navigate(['/dashboard/employees',personalId]);
  }
}
