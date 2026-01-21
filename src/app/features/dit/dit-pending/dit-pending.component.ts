import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService, Ticket, DomainOption } from '../../../core/services/ticket.service'; // Import DomainOption

@Component({
  selector: 'app-dit-pending',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dit-pending.component.html',
  styleUrls: ['./dit-pending.component.css']
})
export class DitPendingComponent implements OnInit {
  pendingTickets: Ticket[] = [];
  domainOptions: DomainOption[] = []; // Store backend domains here
  isLoading = true;
  processingId: number | null = null;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadPendingTickets();
    this.loadDomains(); // Fetch domains when component loads
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

  // NEW: Fetch domains from backend
  loadDomains() {
    this.ticketService.getDomains().subscribe({
      next: (data) => {
        this.domainOptions = data;
         this.cd.detectChanges();
      },
      error: (err) => console.error('Failed to load domains', err)
    });
  }

  approve(ticketId: number, selectElem: HTMLSelectElement) {
    const domain = selectElem.value;

    if (!domain) {
      alert('Please select a Technical Domain (Team) to forward this ticket.');
      return;
    }

    if (!confirm(`Approve ticket #${ticketId} and forward to ${domain} team?`)) return;
    
    this.processingId = ticketId;
    
    this.ticketService.approveAndForward(ticketId, domain).subscribe({
      next: () => {
        alert('Ticket Approved & Forwarded!');
        this.loadPendingTickets();
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
        this.loadPendingTickets();
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