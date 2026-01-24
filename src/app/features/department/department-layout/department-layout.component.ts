import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { FooterComponent } from '../../../core/components/footer/footer.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-department-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent], // <--- IMPORTANT
  templateUrl: './department-layout.component.html',
  styleUrls: ['./department-layout.component.css']
})
export class DepartmentLayoutComponent {
  // Set to 'false' if you want it hidden by default
  isSidebarOpen = false; 
  constructor(private authService: AuthService) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onLogout() {
    this.authService.logout();
  }
}