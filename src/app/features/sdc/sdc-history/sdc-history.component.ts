import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Import this for the button
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-sdc-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sdc-history.component.html',
  styleUrls: ['./sdc-history.component.css']
})
export class SdcHistoryComponent implements OnInit {
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
    this.ticketService.getSdcHistory().subscribe({
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