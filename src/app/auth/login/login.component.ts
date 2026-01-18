import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for [(ngModel)]
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
  credentials = { username: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

// Inside login.component.ts

onSubmit() {
  this.isLoading = true;
  this.errorMessage = '';

  this.authService.login(this.credentials).subscribe({
    next: (res) => {
      this.isLoading = false;
      
  
      console.log('Login Success! Full Response:', res);
      console.log('Role received:', res.role); 
  
      // Normalize the role to lowercase just in case
      const role = res.role ? res.role.toLowerCase() : '';

      switch(role) {
        case 'department':
          console.log('Navigating to Department Dashboard...'); 
          this.router.navigate(['/department/home']);
          break;
        case 'dit':
          this.router.navigate(['/dit/home']);
          break;
        case 'sdc':
          this.router.navigate(['/sdc/home']);
          break;
        default:
          console.error('Unknown Role:', role); // This will tell you if the role is wrong
          this.errorMessage = `Login successful, but unknown role: ${role}`;
      }
    },
    error: (err) => {
      this.isLoading = false;
      console.error('Login Failed', err);
      this.errorMessage = 'Invalid credentials';
    }
  });
}

}