import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, Ticket } from '../../../core/services/ticket.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sdc-active',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './sdc-active.component.html',
  styleUrls: ['./sdc-active.component.css']
})
export class SdcActiveComponent implements OnInit {
  activeTickets: Ticket[] = [];
  isLoading = true;
  processingId: number | null = null;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadActiveTasks();
  }

  loadActiveTasks() {
    this.isLoading = true;
    this.ticketService.getSdcInProgressTickets().subscribe({
      next: (data) => {
        this.activeTickets = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading active tasks:', err);
        this.isLoading = false;
      }
    });
  }

  completeWork(ticketId: number) {
    if(!confirm('Mark this task as fully COMPLETED?')) return;

    this.processingId = ticketId;
    this.ticketService.completeTicket(ticketId).subscribe({
      next: () => {
        alert('Great job! Ticket marked as Completed.');
        this.loadActiveTasks();
        this.processingId = null;
      },
      error: (err) => {
        console.error(err);
        alert('Action failed.');
        this.processingId = null;
      }
    });
  }
}