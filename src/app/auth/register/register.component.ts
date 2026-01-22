import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService, RegisterRequest } from './register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  showDepartment = false;
  showDomain = false;

  // MUST MATCH DJANGO ROLE KEYS
  roles = [
    { value: 'DEPARTMENT', display: 'Department User' },
    { value: 'DIT', display: 'Project Manager' },
    { value: 'SDC', display: 'SDC Staff' },
    { value: 'OFFICER', display: 'Officer' }
  ];

  // Fetched from backend
  departments: string[] = [];
  domainChoices: { value: string, display: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      department: [''],
      domain_name: ['']
    }, {
      validators: this.passwordMatchValidator
    });

    // ROLE CHANGE HANDLER
    this.registerForm.get('role')?.valueChanges.subscribe(role => {

      this.showDepartment = role === 'DEPARTMENT';
      this.showDomain = role === 'SDC';

      // -------- DEPARTMENT USER --------
      if (this.showDepartment) {
        this.registerForm.get('department')?.setValidators([Validators.required]);
        this.fetchDepartments();
      } else {
        this.registerForm.get('department')?.clearValidators();
        this.registerForm.get('department')?.setValue('');
        this.departments = [];
      }

      // -------- SDC STAFF --------
      if (this.showDomain) {
        this.registerForm.get('domain_name')?.setValidators([Validators.required]);
        this.fetchDomains();
      } else {
        this.registerForm.get('domain_name')?.clearValidators();
        this.registerForm.get('domain_name')?.setValue('');
        this.domainChoices = [];
      }

      this.registerForm.get('department')?.updateValueAndValidity();
      this.registerForm.get('domain_name')?.updateValueAndValidity();
    });
  }

  // ---------------- FETCH DEPARTMENTS ----------------
  fetchDepartments() {
    this.registerService.getDepartments().subscribe({
      next: (data: string[]) => {
        this.departments = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load departments';
      }
    });
  }

  // ---------------- FETCH DOMAINS ----------------
  fetchDomains() {
    this.registerService.getDomains().subscribe({
      next: (data: any[]) => {
        this.domainChoices = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load domains';
      }
    });
  }

  // ---------------- PASSWORD VALIDATOR ----------------
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // ---------------- SUBMIT ----------------
  onSubmit() {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // SEND ONLY BACKEND-EXPECTED FIELDS
    const formData: RegisterRequest = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      phone_number: this.registerForm.value.phone_number,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role,
      department_name: this.registerForm.value.department || '',
      domain: this.registerForm.value.domain_name || 'NONE'
    };

    this.registerService.register(formData).subscribe({
      next: () => {
        this.isLoading = false;
      
        // Show success message on same page
        this.errorMessage = '';
        alert('Registration successful! You can register another user.');
      
        // Reset form
        this.registerForm.reset();
      
        // Hide conditional fields
        this.showDepartment = false;
        this.showDomain = false;
      }
      
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }
}
