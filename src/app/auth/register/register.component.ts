import { Component } from '@angular/core';
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
export class RegisterComponent {

  registerForm: FormGroup;
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

  constructor(private fb: FormBuilder, private registerService: RegisterService) {

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      department: [null],
      domain_name: [null]
    }, { validators: this.passwordMatchValidator });

    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.showDepartment = role === 'DEPARTMENT';
      this.showDomain = role === 'SDC';
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const data: RegisterRequest = {
      ...this.registerForm.value,
      department_name: this.registerForm.value.department,
      domain: this.registerForm.value.domain_name
    };

    this.registerService.register(data).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccessModal = true;
        this.registerForm.reset();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Registration failed';
      }
    });
  }

  closeSuccess() {
    this.showSuccessModal = false;
  }
}
