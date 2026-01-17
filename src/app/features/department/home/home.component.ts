import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { TicketService, DashboardStats } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-department-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class DepartmentHomeComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = true;
  currentDate = new Date();

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef // <--- 2. Inject it here
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.isLoading = true;

    this.ticketService.getDepartmentStats().subscribe({
      next: (data) => {
        console.log('Stats loaded:', data);
        this.stats = data;
        this.isLoading = false;
        
        // 3. FORCE THE SCREEN UPDATE
        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error('Stats error:', err);
        this.isLoading = false;
        
        // 3. FORCE THE SCREEN UPDATE (Even on error)
        this.cd.detectChanges(); 
      }
    });
  }
}