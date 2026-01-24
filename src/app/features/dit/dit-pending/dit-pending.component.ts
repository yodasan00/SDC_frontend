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

}