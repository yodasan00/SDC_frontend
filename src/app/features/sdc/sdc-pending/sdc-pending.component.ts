import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-sdc-pending',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sdc-pending.component.html',
  styleUrls: ['./sdc-pending.component.css']
})
export class SdcPendingComponent implements OnInit {
  inboxTickets: Ticket[] = [];
  isLoading = true;
  processingId: number | null = null; // Spinner for specific buttons

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadInbox();
  }

  loadInbox() {
    this.isLoading = true;
    // Calls the endpoint that filters by the user's domain automatically
    this.ticketService.getSdcInbox().subscribe({
      next: (data) => {
        this.inboxTickets = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading inbox:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  startWork(ticketId: number) {
    this.processingId = ticketId;
    
    this.ticketService.startTicket(ticketId).subscribe({
      next: () => {
        // Success: Ticket moves to 'IN_PROGRESS', so it leaves this list
        this.loadInbox();
        this.processingId = null;
        alert('Work Started! Ticket moved to "Active Tasks".');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to start ticket.');
        this.processingId = null;
      }
    });
  }
}