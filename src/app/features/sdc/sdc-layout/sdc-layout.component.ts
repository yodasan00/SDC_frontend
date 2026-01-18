import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { FooterComponent } from '../../../core/components/footer/footer.component';

@Component({
  selector: 'app-sdc-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, HeaderComponent, FooterComponent],
  templateUrl: './sdc-layout.component.html',
  styleUrls: ['./sdc-layout.component.css'] // Re-use dit-layout.css or create new
})
export class SdcLayoutComponent {
  isSidebarOpen = true;
  toggleSidebar() { this.isSidebarOpen = !this.isSidebarOpen; }
}