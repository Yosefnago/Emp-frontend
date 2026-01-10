import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-employee-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-employee-modal-component.html',
  styleUrls: ['./add-employee-modal-component.css']
})
export class AddEmployeeModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() employeeAdded = new EventEmitter<any>();

  isVisible = false;

  // Form model
  employee = {
    firstName: '',
    lastName: '',
    personalId: '',
    email: '',
    phoneNumber: '',
    address: '',
    position: '',
    department: '',
    hireDate: '',
    status: ''
  };

  // Validation flags
  submitted = false;

  // Department options
  departments = [
    'פיתוח',
    'משאבי אנוש',
    'שיווק',
    'מכירות',
    'תמיכה',
    'ניהול',
    'כספים'
  ];

  // Status options
  statuses = [
    { value: 'present', label: 'נוכח' },
    { value: 'absent', label: 'נעדר' },
    { value: 'late', label: 'איחור' },
    { value: 'vacation', label: 'חופשה' }
  ];

  open() {
    this.isVisible = true;
    this.resetForm();
  }

  closeModal() {
    this.isVisible = false;
    this.close.emit();
    this.resetForm();
  }

  resetForm() {
    this.employee = {
      firstName: '',
      lastName: '',
      personalId: '',
      email: '',
      phoneNumber: '',
      address: '',
      position: '',
      department: '',
      hireDate: '',
      status: ''
    };
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;

    // Basic validation
    if (this.isFormValid()) {
      // Emit the employee data to parent component
      this.employeeAdded.emit(this.employee);
      this.closeModal();
    }
  }

  isFormValid(): boolean {
    return !!(
      this.employee.firstName &&
      this.employee.lastName &&
      this.employee.personalId &&
      this.employee.email &&
      this.employee.phoneNumber &&
      this.employee.position &&
      this.employee.department &&
      this.employee.hireDate
    );
  }

  // Validation helpers
  isFieldInvalid(fieldValue: any): boolean {
    return this.submitted && !fieldValue;
  }
}