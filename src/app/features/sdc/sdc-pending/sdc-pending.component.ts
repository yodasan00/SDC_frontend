import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-sdc-pending',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sdc-pending.component.html',
  styleUrls: ['./sdc-pending.component.css']
})
export class SdcPendingComponent implements OnInit {
  tasks: Ticket[] = [];
  isLoading = true;
  processingId: number | null = null; // Locks the button while API is running

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.ticketService.getSdcApprovedTickets().subscribe({
      next: (data) => {
        this.tasks = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  // Step 1: Start the Job
  startWork(ticketId: number) {
    this.processingId = ticketId;
    this.ticketService.startTicket(ticketId).subscribe({
      next: () => {
        // Refresh list to see status change to 'IN_PROGRESS'
        this.loadTasks();
        this.processingId = null;
      },
      error: (err) => {
        console.error(err);
        alert('Could not start ticket.');
        this.processingId = null;
      }
    });
  }

  // Step 2: Finish the Job
  completeWork(ticketId: number) {
    if(!confirm('Are you sure this task is 100% complete?')) return;

    this.processingId = ticketId;
    this.ticketService.completeTicket(ticketId).subscribe({
      next: () => {
        alert('Ticket Marked as Completed!');
        this.loadTasks(); // Ticket should disappear from this list
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