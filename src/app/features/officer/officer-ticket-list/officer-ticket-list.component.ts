import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Need this for input binding
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-officer-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './officer-ticket-list.component.html',
  styleUrls: ['./officer-ticket-list.component.css']
})
export class OfficerTicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  isLoading = true;
  searchTerm: string = '';
  searchTimeout: any;

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    this.ticketService.getAllTicketsForOfficer(this.searchTerm).subscribe({
      next: (data) => {
        this.tickets = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tickets:', err);
        this.isLoading = false;
      }
    });
  }

  // Debounce logic: Waits 500ms after typing stops before calling API
  onSearchChange() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
      this.loadTickets();
    }, 500);
  }
}