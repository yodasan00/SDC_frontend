import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() title: string = 'Service Desk';
  @Output() toggleSidebar = new EventEmitter<void>();

  currentDate = new Date();

  onToggle() {
    this.toggleSidebar.emit();
  }
}