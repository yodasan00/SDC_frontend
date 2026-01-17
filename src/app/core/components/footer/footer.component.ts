import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <p>&copy; 2026 State Data Centre Service Desk. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: #f8f9fa;
      padding: 1rem;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      color: #95a5a6;
      font-size: 0.85rem;
      margin-top: auto; 
    }
    p { margin: 0; }
  `]
})
export class FooterComponent {}