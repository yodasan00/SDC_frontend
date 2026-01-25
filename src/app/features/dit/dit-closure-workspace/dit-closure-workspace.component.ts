import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket, AuditLog } from '../../../core/services/ticket.service'; // Added AuditLog interface
import { ModalService } from '../../../core/services/modal.service';
import { SlaStatusDirective } from '../../../shared/directives/sla-status.directive';

@Component({
  selector: 'app-dit-closure-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SlaStatusDirective],
  templateUrl: './dit-closure-workspace.component.html',
  styleUrls: ['./dit-closure-workspace.component.css']
})
export class DitClosureWorkspaceComponent implements OnInit {
  ticket: Ticket | null = null;
  isLoading = true;
  remarks = '';
  workLogs: AuditLog[] = []; // Typed array for logs

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadTicket(id);
      this.loadWorkHistory(id); // <--- 1. CALL THIS ON LOAD
    }
  }

  loadTicket(id: number) {
    this.isLoading = true;
    this.ticketService.getTicketById(id).subscribe({
      next: (t) => {
        this.ticket = t;
        this.isLoading = false;
        
        // Validation: Only allow closure if COMPLETED
        if (t.status !== 'COMPLETED' && t.status !== 'CLOSED') {
           this.modalService.open({ title: 'Invalid Status', message: 'Ticket not ready for closure.', type: 'error' });
           this.router.navigate(['/dit/history']);
        }
        this.cd.detectChanges();
      },
      error: () => {
        this.router.navigate(['/dit/history']);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  // 2. FETCH WORK LOGS FUNCTION
  loadWorkHistory(id: number) {
    this.ticketService.getAuditLogs(id).subscribe({
      next: (logs) => {
        // Filter to only show specific "Work Update" actions
        this.workLogs = logs.filter(log => log.action === 'Work Update');
        this.cd.detectChanges();
      },
      error: (err) => console.error('Failed to load logs', err)
    });
  }

  verifyAndClose() {
    this.modalService.open({
      title: 'Confirm Closure',
      message: 'Close this ticket permanently?',
      type: 'confirm',
      confirmText: 'Yes, Close'
    }, () => {
      this.ticketService.closeTicket(this.ticket!.id).subscribe({
        next: () => {
          this.modalService.open({ title: 'Success', message: 'Ticket Closed.', type: 'success' });
          this.router.navigate(['/dit/history']);
        },
        error: () => {
          this.modalService.open({ title: 'Error', message: 'Failed to close ticket.', type: 'error' });
        }
      });
    });
  }

  reopenTicket() {
    this.modalService.open({
      title: 'Reopen Ticket',
      message: 'Is the work incomplete? Provide a reason to send it back to SDC:',
      type: 'confirm',
      confirmText: 'Reopen & Send Back',
      showInput: true 
    }, (reason) => {
      if (!reason) return;

      this.ticketService.reopenTicket(this.ticket!.id, reason).subscribe({
        next: () => {
          this.modalService.open({ 
            title: 'Reopened', 
            message: 'Ticket has been sent back to the SDC team (In Progress).', 
            type: 'success' 
          }, () => {
            this.router.navigate(['/dit/completed-tickets']); 
          });
        },
        error: () => {
          this.modalService.open({ title: 'Error', message: 'Failed to reopen ticket.', type: 'error' });
          this.cd.detectChanges();
        }
      });
    });
  }
}