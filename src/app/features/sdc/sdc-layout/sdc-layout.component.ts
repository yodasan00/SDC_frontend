import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { FooterComponent } from '../../../core/components/footer/footer.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-sdc-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent],
  templateUrl: './sdc-layout.component.html',
  styleUrls: ['./sdc-layout.component.css'] 
})
export class SdcLayoutComponent {
  isSidebarOpen = false;
  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}