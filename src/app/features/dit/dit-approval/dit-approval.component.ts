import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SlaStatusDirective } from '../../../shared/directives/sla-status.directive';

import { 
  TicketService, 
  Ticket, 
  DomainOption, 
  PriorityOption, 
  TicketType, 
  RequestType 
} from '../../../core/services/ticket.service';

import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-dit-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SlaStatusDirective],
  templateUrl: './dit-approval.component.html',
  styleUrls: ['./dit-approval.component.css']
})
export class DitApprovalComponent implements OnInit {
  ticket: Ticket | null = null;
  domains: DomainOption[] = [];
  priorities: PriorityOption[] = [];
  
  ticketTypes: TicketType[] = [];
  requestTypes: RequestType[] = [];

  selectedDomain = '';
  remarks = '';
  isProcessing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef // <--- 2. Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTicket(id);
    }
    this.loadMetadata();
  }

  loadMetadata() {
    this.ticketService.getDomains().subscribe(d => {
      this.domains = d;
      this.cd.detectChanges(); // <--- 3. Trigger detection
    });

    this.ticketService.getPriorities().subscribe(p => {
      this.priorities = p;
      this.cd.detectChanges();
    });
    
    this.ticketService.getTicketTypes().subscribe(t => {
      this.ticketTypes = t;
      this.cd.detectChanges(); // Update view so getTypeName() works
    });
  }

  loadTicket(id: number) {
    this.ticketService.getTicketById(id).subscribe({
      next: (t) => {
        this.ticket = t;
        if (t.domain_value) this.selectedDomain = t.domain_value;

        // If ticket has a Type ID, fetch the sub-categories
        if (t.ticket_type) {
           this.ticketService.getRequestTypes(t.ticket_type).subscribe(r => {
             this.requestTypes = r;
             this.cd.detectChanges(); // Update view so getRequestName() works
           });
        }
        this.cd.detectChanges(); // <--- Trigger for ticket data load
      },
      error: () => {
        this.modalService.open({ title: 'Error', message: 'Ticket not found.', type: 'error' }, () => {
          this.router.navigate(['/dit/pending']);
        });
      }
    });
  }

  getTypeName(id?: number): string {
    if (!id) return 'General';
    const match = this.ticketTypes.find(t => t.id === id);
    return match ? match.name : 'Unknown';
  }

  getRequestName(id?: number): string {
    if (!id) return '';
    const match = this.requestTypes.find(r => r.id === id);
    return match ? match.name : '';
  }

  approve() {
    if (!this.selectedDomain) {
      this.modalService.open({ title: 'Required', message: 'Please select a domain.', type: 'error' });
      return;
    }
    this.isProcessing = true;
    this.ticketService.approveAndForward(this.ticket!.id, this.selectedDomain, this.ticket!.priority, this.remarks)
      .subscribe({
        next: () => {
          this.modalService.open({ title: 'Success', message: 'Ticket forwarded.', type: 'success' }, 
          () => this.router.navigate(['/dit/pending']));
        },
        error: () => {
          this.isProcessing = false;
          this.cd.detectChanges(); // Reset button state if error
        }
      });
  }

  reject() {
    this.modalService.open({
      title: 'Reject Ticket', message: 'Reason for rejection:', type: 'confirm', showInput: true
    }, (reason) => {
      if (!reason) return;
      this.isProcessing = true;
      this.ticketService.rejectTicket(this.ticket!.id, reason).subscribe({
        next: () => this.router.navigate(['/dit/pending']),
        error: () => {
          this.isProcessing = false;
          this.cd.detectChanges();
        }
      });
    });
  }

  closeTicket() {
    this.modalService.open({ title: 'Close Ticket', message: 'Permanently close this ticket?', type: 'confirm' }, () => {
      this.ticketService.closeTicket(this.ticket!.id).subscribe({
        next: () => this.router.navigate(['/dit/history'])
      });
    });
  }
}