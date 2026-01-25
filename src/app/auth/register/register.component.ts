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

  // 🔑 PK-based objects (FIXED TYPES)
  departments: { value: number; display: string }[] = [];
  domainChoices: { value: number; display: string }[] = [];

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
      department: [null],
      domain_name: [null]
    }, {
      validators: this.passwordMatchValidator
    });

    // 🔁 ROLE CHANGE HANDLER
    this.registerForm.get('role')?.valueChanges.subscribe(role => {

      this.showDepartment = role === 'DEPARTMENT';
      this.showDomain = role === 'SDC';

      // -------- DEPARTMENT USER --------
      if (this.showDepartment) {
        this.registerForm.get('department')?.setValidators([Validators.required]);
        this.fetchDepartments();
      } else {
        this.registerForm.get('department')?.clearValidators();
        this.registerForm.get('department')?.setValue(null);
        this.departments = [];
      }

      // -------- SDC STAFF --------
      if (this.showDomain) {
        this.registerForm.get('domain_name')?.setValidators([Validators.required]);
        this.fetchDomains();
      } else {
        this.registerForm.get('domain_name')?.clearValidators();
        this.registerForm.get('domain_name')?.setValue(null);
        this.domainChoices = [];
      }

      this.registerForm.get('department')?.updateValueAndValidity();
      this.registerForm.get('domain_name')?.updateValueAndValidity();
    });
  }

  // ---------------- FETCH DEPARTMENTS ----------------
  fetchDepartments() {
    this.registerService.getDepartments().subscribe({
      next: (data: any[]) => {
        this.departments = data.map(dep => ({
          value: dep.id,        // ✅ PK (number)
          display: dep.name     // ✅ shown to user
        }));
      },
      error: () => {
        this.errorMessage = 'Failed to load departments';
      }
    });
  }

  // ---------------- FETCH DOMAINS ----------------
  fetchDomains() {
    this.registerService.getDomains().subscribe({
      next: (data: any) => {
  
        // ✅ Handle ALL Django response shapes
        const domains = Array.isArray(data)
          ? data
          : data.results ?? [];
  
        this.domainChoices = domains.map((dom: any) => ({
          value: dom.id,                          // PK
          display: dom.display   // safe display
        }));
  
        console.log('Domains loaded:', this.domainChoices); // debug
      },
      error: (err) => {
        console.error('Domain fetch error:', err);
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

    const formData: RegisterRequest = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      phone_number: this.registerForm.value.phone_number,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role,

      // ✅ SEND PK VALUES (NOT STRING)
      department_name: this.registerForm.value.department,
      domain: this.registerForm.value.domain_name
    };

    this.registerService.register(formData).subscribe({
      next: () => {
        this.isLoading = false;
        alert('Registration successful! You can register another user.');

        this.registerForm.reset();
        this.showDepartment = false;
        this.showDomain = false;
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed';
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }
}
