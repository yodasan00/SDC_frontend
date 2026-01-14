import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, Ticket, DashboardStats } from '../../../core/services/ticket.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-department-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DepartmentDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  tickets: Ticket[] = [];
  isLoading = true;

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Fetch Stats
    this.ticketService.getDepartmentStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => console.error('Failed to load stats', err)
    });

    // Fetch Recent Tickets
    this.ticketService.getMyTickets().subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (err) => console.error('Failed to load tickets', err)
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'COMPLETED': return 'status-completed';
      default: return '';
    }
  }
}