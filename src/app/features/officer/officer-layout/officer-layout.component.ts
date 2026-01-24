import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { FooterComponent } from '../../../core/components/footer/footer.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-officer-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent],
  templateUrl: './officer-layout.component.html',
  styleUrl: './officer-layout.component.css',
})
export class OfficerLayoutComponent {
  isSidebarOpen = false;
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
