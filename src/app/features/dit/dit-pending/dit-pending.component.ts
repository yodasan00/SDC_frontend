import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-dit-pending',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dit-pending.component.html',
  styleUrls: ['./dit-pending.component.css']
})
export class DitPendingComponent implements OnInit {
  pendingTickets: Ticket[] = [];
  isLoading = true;
  processingId: number | null = null; // To show spinner on specific button

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPendingTickets();
  }

  loadPendingTickets() {
    this.isLoading = true;
    this.ticketService.getPendingTickets().subscribe({
      next: (data) => {
        this.pendingTickets = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching pending tickets:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  approve(ticketId: number) {
    if (!confirm('Are you sure you want to APPROVE this ticket?')) return;
    
    this.processingId = ticketId;
    this.ticketService.approveTicket(ticketId).subscribe({
      next: () => {
        alert('Ticket Approved!');
        this.loadPendingTickets(); // Refresh list
        this.processingId = null;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to approve ticket.');
        this.processingId = null;
      }
    });
  }

  reject(ticketId: number) {
    if (!confirm('Are you sure you want to REJECT this ticket?')) return;

    this.processingId = ticketId;
    this.ticketService.rejectTicket(ticketId).subscribe({
      next: () => {
        alert('Ticket Rejected.');
        this.loadPendingTickets(); // Refresh list
        this.processingId = null;
      },
      error: (err) => {
        console.error(err);
        alert('Failed to reject ticket.');
        this.processingId = null;
      }
    });
  }
}