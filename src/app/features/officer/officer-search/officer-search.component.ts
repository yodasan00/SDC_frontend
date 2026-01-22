import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- Import
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-officer-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './officer-search.component.html',
  styleUrls: ['./officer-search.component.css']
})
export class OfficerSearchComponent implements OnInit {
  tickets: Ticket[] = [];
  searchTerm: string = '';
  isLoading = false;
  searchTimeout: any;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef // <--- Inject
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true; 
    
    this.ticketService.getAllTicketsForOfficer(this.searchTerm).subscribe({
      next: (data) => {
        this.tickets = data;
        this.isLoading = false;
        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cd.detectChanges(); 
      }
    });
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadTickets();
    }, 400);
  }
}