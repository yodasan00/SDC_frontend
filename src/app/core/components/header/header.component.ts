import { Component, Input, Output, EventEmitter } from '@angular/core'; // <--- Import Output, EventEmitter
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="left-section">
        <button class="menu-btn" (click)="onToggle()">
          <span class="material-icon">☰</span>
        </button>
        <h1>{{ title }}</h1>
      </div>

      <div class="user-info">
        <span class="date">{{ currentDate | date:'mediumDate' }}</span>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      background-color: white;
      padding: 0 2rem;
      height: 60px; /* Fixed height for consistency */
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .left-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .menu-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      transition: background 0.2s;
      display: flex; /* Centers the icon */
    }
    .menu-btn:hover {
      background-color: #f0f0f0;
    }
    h1 {
      margin: 0;
      font-size: 1.2rem;
      color: #2c3e50;
    }
    .date { color: #7f8c8d; font-size: 0.9rem; }
  `]
})
export class HeaderComponent {
  @Input() title: string = 'Service Desk';
  @Output() toggleSidebar = new EventEmitter<void>(); // <--- The Event

  currentDate = new Date();

  onToggle() {
    this.toggleSidebar.emit(); // Send signal to parent
  }
}