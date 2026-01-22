import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../../core/services/ticket.service';
import { ModalService } from '../../../core/services/modal.service'; // <--- Import

@Component({
  selector: 'app-sdc-workspace',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sdc-workspace.component.html',
  styleUrls: ['./sdc-workspace.component.css']
})
export class SdcWorkspaceComponent implements OnInit {
  ticket: Ticket | null = null;
  isLoading = true;
  isProcessing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private cd: ChangeDetectorRef,
    private modalService: ModalService // <--- Inject
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTicket(id);
  }

  loadTicket(id: number) {
    this.isLoading = true;
    this.ticketService.getTicketById(id).subscribe({
      next: (t) => {
        this.ticket = t;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        // REPLACEMENT: Error Modal
        this.modalService.open({
          title: 'Not Found',
          message: 'This ticket does not exist or you do not have permission to view it.',
          type: 'error'
        }, () => {
           this.router.navigate(['/sdc/inbox']);
        });
      }
    });
  }

  startWork() {
    // REPLACEMENT: Confirm Modal
    this.modalService.open({
      title: 'Start Work',
      message: 'Are you ready to start working on this ticket?',
      type: 'confirm',
      confirmText: 'Start Now'
    }, () => {
      
      // LOGIC MOVED INSIDE CALLBACK
      this.isProcessing = true;
      this.cd.detectChanges();

      this.ticketService.startTicket(this.ticket!.id).subscribe({
        next: () => {
          this.modalService.open({
            title: 'Work Started',
            message: 'Status updated to In Progress.',
            type: 'success'
          });
          
          // Reload to update status
          this.loadTicket(this.ticket!.id);
          this.isProcessing = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.isProcessing = false;
          this.cd.detectChanges();
          this.modalService.open({ title: 'Error', message: 'Failed to start work.', type: 'error' });
        }
      });
    });
  }

  completeWork() {
    // REPLACEMENT: Confirm Modal
    this.modalService.open({
      title: 'Complete Ticket',
      message: 'Are you sure you want to mark this ticket as COMPLETED?',
      type: 'confirm',
      confirmText: 'Mark Complete'
    }, () => {
      
      // LOGIC MOVED INSIDE CALLBACK
      this.isProcessing = true;
      this.cd.detectChanges();

      this.ticketService.completeTicket(this.ticket!.id).subscribe({
        next: () => {
          this.modalService.open({
            title: 'Success!',
            message: 'Ticket completed successfully.',
            type: 'success'
          }, () => {
             this.router.navigate(['/sdc/pending']);
          });
        },
        error: () => {
          this.isProcessing = false;
          this.cd.detectChanges();
          this.modalService.open({ title: 'Error', message: 'Failed to complete ticket.', type: 'error' });
        }
      });
    });
  }

  revertWork() {
    // REPLACEMENT: Prompt Modal (Input Logic)
    this.modalService.open({
      title: 'Revert to Manager',
      message: 'Please explain why you are sending this ticket back (e.g., Wrong Domain):',
      type: 'confirm',
      confirmText: 'Revert Ticket',
      showInput: true // <--- Enables the Textarea
    }, (reason) => {
      
      // Validation: Check if reason was entered
      if (!reason) {
        this.modalService.open({ title: 'Required', message: 'You must provide a reason to revert.', type: 'error' });
        return;
      }

      // LOGIC MOVED INSIDE CALLBACK
      this.isProcessing = true;
      this.cd.detectChanges();

      this.ticketService.revertTicket(this.ticket!.id, reason).subscribe({
        next: () => {
          this.modalService.open({
            title: 'Reverted',
            message: 'Ticket has been sent back to the Project Manager.',
            type: 'success'
          }, () => {
             this.router.navigate(['/sdc/pending']);
          });
        },
        error: (err) => {
          this.isProcessing = false;
          this.cd.detectChanges();
          this.modalService.open({ title: 'Error', message: 'Failed to revert ticket.', type: 'error' });
        }
      });
    });
  }
}