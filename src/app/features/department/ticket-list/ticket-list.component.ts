// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { TicketService, Ticket } from '../../../core/services/ticket.service';
// import { finalize } from 'rxjs/operators';

// @Component({
//   selector: 'app-ticket-list',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './ticket-list.component.html',
//   styleUrls: ['./ticket-list.component.css']
// })
// export class TicketListComponent implements OnInit {
//   tickets: Ticket[] = [];
//   isLoading = true;

//   constructor(private ticketService: TicketService) {}

//   ngOnInit() {
//     this.loadTickets();
//   }

//   loadTickets() {
//   this.isLoading = true;
  
//   this.ticketService.getMyTickets().subscribe({
//     next: (data) => {
//       console.log('Data received:', data);
//       this.tickets = data;
//       // Update loading status INSIDE the success block
//       this.isLoading = false; 
//     },
//     error: (err) => {
//       console.error('Error fetching tickets:', err);
//       // Update loading status INSIDE the error block
//       this.isLoading = false; 
//     }
//   });
// }

//   // Returns the CSS class based on the ticket status
//   getStatusClass(status: string): string {
//     // Normalize to uppercase just in case
//     const safeStatus = status ? status.toUpperCase() : '';
    
//     switch (safeStatus) {
//       case 'PENDING': return 'status-pending';
//       case 'APPROVED': return 'status-approved';
//       case 'REJECTED': return 'status-rejected';
//       case 'IN_PROGRESS': return 'status-progress'; // Optional, if you have this state
//       case 'COMPLETED': return 'status-completed';
//       default: return '';
//     }
//   }
// }

import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import this
import { CommonModule } from '@angular/common';
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  isLoading = true;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef // <--- 2. Inject it here
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;
    
    this.ticketService.getMyTickets().subscribe({
      next: (data) => {
        console.log('Tickets loaded:', data);
        this.tickets = data;
        this.isLoading = false;
        
        // 3. FORCE THE SCREEN UPDATE
        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching tickets:', err);
        this.isLoading = false;
        
        // 3. FORCE THE SCREEN UPDATE (Even on error)
        this.cd.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    const safeStatus = status ? status.toUpperCase() : '';
    switch (safeStatus) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'IN_PROGRESS': return 'status-progress';
      case 'COMPLETED': return 'status-completed';
      default: return '';
    }
  }
}