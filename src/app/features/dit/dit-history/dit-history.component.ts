import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Important for the "View" button
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-dit-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dit-history.component.html',
  styleUrls: ['./dit-history.component.css']
})
export class DitHistoryComponent implements OnInit {
  historyTickets: Ticket[] = [];
  isLoading = true;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.ticketService.getDitHistory().subscribe({
      next: (data) => {
        this.historyTickets = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }
}