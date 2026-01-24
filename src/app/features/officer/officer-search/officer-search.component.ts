import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// 1. Import DomainOption
import { TicketService, Ticket, DomainOption } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-officer-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './officer-search.component.html',
  styleUrls: ['./officer-search.component.css']
})
export class OfficerSearchComponent implements OnInit {
  tickets: Ticket[] = [];
  
  // 2. Add Domains List
  domains: DomainOption[] = [];
  
  searchTerm: string = '';
  isLoading = false;
  searchTimeout: any;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTickets();
    // 3. Load Metadata (Domains) on Init
    this.loadMetadata();
  }

  // 4. Fetch Domain List
  loadMetadata() {
    this.ticketService.getDomains().subscribe(data => {
      this.domains = data;
      this.cd.detectChanges();
    });
  }

  // 5. Helper Function to translate ID -> Name
  getDomainName(id: number): string {
    if (!id) return ''; // Handle null/undefined
    const match = this.domains.find(d => d.id === id);
    return match ? match.display : 'Unknown Domain';
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