import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-dit-completed-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dit-completed-tickets.component.html',
  styleUrls: ['./dit-completed-tickets.component.css']
})
export class DitCompletedTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  isLoading = true;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef // <--- 2. Inject
  ) {}

  ngOnInit() {
    this.loadCompletedTickets();
  }

  loadCompletedTickets() {
    this.isLoading = true;
    this.ticketService.getDitHistory().subscribe({
      next: (allTickets) => {
        // Filter specifically for COMPLETED status (Waiting for verification)
        this.tickets = allTickets.filter(t => t.status === 'COMPLETED');
        this.isLoading = false;
        this.cd.detectChanges(); // <--- 3. Trigger Update
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cd.detectChanges(); // <--- 4. Ensure Loading spinner disappears
      }
    });
  }
}