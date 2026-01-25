import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials = {
    identifier: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    const identifier = this.credentials.identifier?.trim();
    const password = this.credentials.password;

    // ✅ HARD GUARD (prevents blank submission)
    if (!identifier || !password) {
      this.errorMessage = 'Please enter username / email / phone and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({
      identifier: identifier,
      password: password
    }).subscribe({
      next: (res) => {
        this.isLoading = false;

        console.log('Login Success!', res);

        const role = res.role ? res.role.toLowerCase() : '';

        switch (role) {
          case 'department':
            this.router.navigate(['/department/home']);
            break;
          case 'dit':
            this.router.navigate(['/dit/home']);
            break;
          case 'sdc':
            this.router.navigate(['/sdc/home']);
            break;
          case 'officer':
            this.router.navigate(['/officer/dashboard']);
            break;
          default:
            this.errorMessage = 'Login successful, but role not recognized';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Invalid username / email / phone or password';
      }
    });
  }
}
