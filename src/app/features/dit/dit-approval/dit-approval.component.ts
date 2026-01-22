import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket, DomainOption } from '../../../core/services/ticket.service';
import { ModalService } from '../../../core/services/modal.service'; // <--- Import

@Component({
  selector: 'app-dit-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dit-approval.component.html',
  styleUrls: ['./dit-approval.component.css']
})
export class DitApprovalComponent implements OnInit {
  ticket: Ticket | null = null;
  domains: DomainOption[] = [];
  
  selectedDomain: string = '';
  remarks: string = '';
  
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
    this.loadData(id);
  }

  loadData(id: number) {
    // 1. Load Ticket
    this.ticketService.getTicketById(id).subscribe({
      next: (t) => {
        this.ticket = t;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cd.detectChanges();
        // Optional: Add error modal here if load fails
        this.modalService.open({ title: 'Error', message: 'Failed to load ticket details.', type: 'error' });
      }
    });

    // 2. Load Domains
    this.ticketService.getDomains().subscribe({
      next: (d) => {
        this.domains = d;
        this.cd.detectChanges();
      }
    });
  }

  approve() {
    // Validation Check
    if (!this.selectedDomain) {
      this.modalService.open({
        title: 'Missing Information',
        message: 'Please select a Technical Domain before approving.',
        type: 'error'
      });
      return;
    }

    // Confirmation Modal
    this.modalService.open({
      title: 'Confirm Approval',
      message: `Are you sure you want to forward this ticket to the ${this.selectedDomain} team?`,
      type: 'confirm',
      confirmText: 'Approve & Forward'
    }, () => {
      
      // LOGIC MOVED INSIDE CALLBACK
      this.isProcessing = true;
      this.cd.detectChanges(); // Show disabled state

      this.ticketService.approveAndForward(this.ticket!.id, this.selectedDomain, this.remarks).subscribe({
        next: () => {
          this.modalService.open({
            title: 'Success',
            message: 'Ticket has been approved and forwarded successfully!',
            type: 'success'
          }, () => {
            // Navigate after closing success modal
            this.router.navigate(['/dit/pending']);
          });
        },
        error: (err) => {
          this.isProcessing = false;
          this.cd.detectChanges(); // Re-enable buttons
          
          this.modalService.open({
            title: 'Approval Failed',
            message: 'An error occurred while approving the ticket. Please try again.',
            type: 'error'
          });
        }
      });
    });
  }

  reject() {
    // Determine the warning message based on whether remarks exist
    const confirmMsg = this.remarks 
      ? 'Are you sure you want to reject this ticket?' 
      : 'You are rejecting this ticket without remarks. Are you sure?';

    this.modalService.open({
      title: 'Confirm Rejection',
      message: confirmMsg,
      type: 'confirm',
      confirmText: 'Reject Ticket'
    }, () => {
      
      // LOGIC MOVED INSIDE CALLBACK
      this.isProcessing = true;
      this.cd.detectChanges();

      this.ticketService.rejectTicket(this.ticket!.id, this.remarks).subscribe({
        next: () => {
          this.modalService.open({
            title: 'Rejected',
            message: 'The ticket has been rejected.',
            type: 'success'
          }, () => {
             this.router.navigate(['/dit/pending']);
          });
        },
        error: () => {
          this.isProcessing = false;
          this.cd.detectChanges();
          
          this.modalService.open({
            title: 'Rejection Failed',
            message: 'Could not reject the ticket. Please try again.',
            type: 'error'
          });
        }
      });
    });
  }
}