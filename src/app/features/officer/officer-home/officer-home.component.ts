import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-officer-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './officer-home.component.html',
  styleUrls: ['./officer-home.component.css']
})
export class OfficerHomeComponent implements OnInit {
  stats: any = null;
  isLoading = true;

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    // Calls GET /api/tickets/officer/stats/
    this.ticketService.getOfficerStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load stats', err);
        this.isLoading = false;
      }
    });
  }
}