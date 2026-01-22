import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, Ticket } from '../../../core/services/ticket.service';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../../core/services/modal.service'; // <--- Import

@Component({
  selector: 'app-sdc-active',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sdc-active.component.html',
  styleUrls: ['./sdc-active.component.css']
})
export class SdcActiveComponent implements OnInit {
  activeTickets: Ticket[] = [];
  isLoading = true;
  processingId: number | null = null;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef,
    private modalService: ModalService // <--- Inject
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
        this.cd.detectChanges();
        
        // Optional: Error Modal for loading failure
        this.modalService.open({
            title: 'Connection Error', 
            message: 'Failed to load active tasks.', 
            type: 'error' 
        });
      }
    });
  }

  completeWork(ticketId: number) {
    // REPLACEMENT: Confirm Modal
    this.modalService.open({
      title: 'Complete Task',
      message: 'Are you sure you want to mark this task as fully COMPLETED?',
      type: 'confirm',
      confirmText: 'Yes, Complete'
    }, () => {
      
      // LOGIC MOVED INSIDE CALLBACK
      this.processingId = ticketId;
      this.cd.detectChanges();

      this.ticketService.completeTicket(ticketId).subscribe({
        next: () => {
          // REPLACEMENT: Success Modal
          this.modalService.open({
            title: 'Great Job!',
            message: 'Ticket has been marked as Completed successfully.',
            type: 'success'
          }, () => {
             // Refresh data after modal closes
             this.loadActiveTasks();
             this.processingId = null;
          });
        },
        error: (err) => {
          console.error(err);
          this.processingId = null;
          this.cd.detectChanges();
          this.modalService.open({
            title: 'Action Failed',
            message: 'Could not complete the ticket. Please try again.',
            type: 'error'
          });
        }
      });
    });
  }
}