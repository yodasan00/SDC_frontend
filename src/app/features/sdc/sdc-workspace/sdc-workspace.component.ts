import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket, AuditLog } from '../../../core/services/ticket.service';
import { ModalService } from '../../../core/services/modal.service';

// Directive
import { SlaStatusDirective } from '../../../shared/directives/sla-status.directive';

@Component({
  selector: 'app-sdc-workspace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SlaStatusDirective],
  templateUrl: './sdc-workspace.component.html',
  styleUrls: ['./sdc-workspace.component.css']
})
export class SdcWorkspaceComponent implements OnInit {
  ticket: Ticket | null = null;
  isLoading = true;
  workLogs: AuditLog[] = [];
  
  showProgressModal = false;
  progressNote = '';

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
      this.loadWorkHistory(id);
    }
  }

  loadTicket(id: number) {
    this.isLoading = true;
    this.ticketService.getTicketById(id).subscribe({
      next: (t) => {
        this.ticket = t;
        this.isLoading = false;
        this.cd.detectChanges(); // <--- 3. Update view with ticket data
      },
      error: () => {
        this.isLoading = false;
        this.modalService.open({ title: 'Error', message: 'Ticket not found', type: 'error' }, () => {
          this.router.navigate(['/sdc/inbox']);
        });
        this.cd.detectChanges();
      }
    });
  }

  // 1. Start Work
  startWork() {
    this.modalService.open({
      title: 'Start Work',
      message: 'Are you ready to begin working on this ticket?',
      type: 'confirm',
      confirmText: 'Start Timer'
    }, () => {
      this.ticketService.startTicket(this.ticket!.id).subscribe(() => {
        this.loadTicket(this.ticket!.id); // Refresh to update status
      });
    });
  }

  // 2. Open Log Modal
  openProgressModal() {
    this.progressNote = '';
    this.showProgressModal = true;
    this.cd.detectChanges(); // <--- Ensure modal opens immediately
  }

  // 3. Submit Log
  submitProgress() {
    if (!this.progressNote.trim()) return;

    this.ticketService.logProgress(this.ticket!.id, this.progressNote).subscribe({
      next: () => {
        this.showProgressModal = false;
        this.modalService.open({ title: 'Logged', message: 'Work progress saved to audit log.', type: 'success' });
        this.loadWorkHistory(this.ticket!.id);
        this.cd.detectChanges(); // <--- Ensure modal closes immediately
      },
      error: () => {
        this.modalService.open({ title: 'Error', message: 'Failed to save log.', type: 'error' });
      }
    });
  }

  // 4. Complete Ticket
  completeWork() {
    this.modalService.open({
      title: 'Complete Ticket',
      message: 'Mark this ticket as resolved? This will notify the PM.',
      type: 'confirm',
      confirmText: 'Mark Completed'
    }, () => {
      this.ticketService.completeTicket(this.ticket!.id).subscribe(() => {
        this.router.navigate(['/sdc/history']);
      });
    });
  }

  loadWorkHistory(id: number) {
    this.ticketService.getAuditLogs(id).subscribe({
      next: (logs) => {
        // Filter: Only show "Work Update" actions
        this.workLogs = logs.filter(log => log.action === 'Work Update');
        this.cd.detectChanges();
      }
    });
  }

  // 5. Revert Ticket
  revertTicket() {
    this.modalService.open({
      title: 'Revert Ticket',
      message: 'Send back to PM? (Use only if assigned incorrectly)',
      type: 'confirm',
      showInput: true,
      confirmText: 'Revert'
    }, (reason) => {
      if (!reason) return;
      this.ticketService.revertTicket(this.ticket!.id, reason).subscribe(() => {
        this.router.navigate(['/sdc/inbox']);
      });
    });
  }
}