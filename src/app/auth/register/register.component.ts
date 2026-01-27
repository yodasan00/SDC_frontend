import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RegisterService, RegisterRequest } from './register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showSuccessModal = false;

  showDepartment = false;
  showDomain = false;

  roles = [
    { value: 'DEPARTMENT', display: 'Department User' },
    { value: 'DIT', display: 'Project Manager' },
    { value: 'SDC', display: 'SDC Staff' },
    { value: 'OFFICER', display: 'Officer' }
  ];

  departments: { value: number; display: string }[] = [];
  domainChoices: { value: number; display: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.handleRoleChange();
  }

  // ---------------- FORM ----------------

  initForm() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      department: [''],
      domain_name: ['']
    }, { validators: this.passwordMatchValidator });
  }

  // ---------------- ROLE CHANGE ----------------

  handleRoleChange() {
    this.registerForm.get('role')?.valueChanges.subscribe(role => {

      this.showDepartment = false;
      this.showDomain = false;

      this.registerForm.patchValue({
        department: '',
        domain_name: ''
      });

      if (role === 'DEPARTMENT') {
        this.showDepartment = true;
        this.loadDepartments();
      }

      if (role === 'SDC') {
        this.showDomain = true;
        this.loadDomains();
      }
    });
  }

  // ---------------- API CALLS ----------------

  loadDepartments() {
    this.registerService.getDepartments().subscribe({
      next: (res: any[]) => {
        this.departments = res.map(d => ({
          value: d.id,
          display: d.name
        }));
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to load departments';
      }
    });
  }

  loadDomains() {
    this.registerService.getDomains().subscribe({
      next: (res: any[]) => {
        this.domainChoices = res.map(d => ({
          value: d.value,   // backend sends value as string
          display: d.display
        }));
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to load domains';
      }
    });
  }

  // ---------------- VALIDATOR ----------------

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  // ---------------- SUBMIT ----------------

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const data: RegisterRequest = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      phone_number: this.registerForm.value.phone_number,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role,
      department_name: this.registerForm.value.department || null,
      domain: this.registerForm.value.domain_name || null
    };

    this.registerService.register(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccessModal = true;
        this.registerForm.reset();
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
        this.errorMessage = 'Registration failed';
      }
    });
  }

  closeSuccess() {
    this.showSuccessModal = false;
  }
}
