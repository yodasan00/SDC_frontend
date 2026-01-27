import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket, AuditLog } from '../../../core/services/ticket.service';
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
  workLogs: AuditLog[] = [];

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
      this.loadWorkHistory(id);
    }
  }

  // =========================
  // 🔒 EXISTING API LOGIC
  // =========================
  loadTicket(id: number) {
    this.isLoading = true;
    this.ticketService.getTicketById(id).subscribe({
      next: (t) => {
        this.ticket = t;
        this.isLoading = false;

        if (t.status !== 'COMPLETED' && t.status !== 'CLOSED') {
          this.modalService.open({
            title: 'Invalid Status',
            message: 'Ticket not ready for closure.',
            type: 'error'
          });
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

  loadWorkHistory(id: number) {
    this.ticketService.getAuditLogs(id).subscribe({
      next: (logs) => {
        this.workLogs = logs.filter(
          log => log.action === 'Work Update'
        );
        this.cd.detectChanges();
      },
      error: (err) => console.error('Failed to load logs', err)
    });
  }

  // =========================
  // ✅ SLA CHECK (SMALL ADD)
  // =========================
  isOverdue(ticket: Ticket | null): boolean {
    if (!ticket?.created_at || !ticket?.sla_time) {
      return false;
    }

    const createdAt = new Date(ticket.created_at).getTime();
    const slaMs = this.parseDurationToMs(ticket.sla_time);

    return Date.now() > (createdAt + slaMs);
  }

  parseDurationToMs(duration: string): number {
    let days = 0;
    let timePart = duration;

    // Django format: "1 day, 0:00:00"
    if (duration.includes('day')) {
      const parts = duration.split(',');
      days = parseInt(parts[0].trim().split(' ')[0], 10);
      timePart = parts[1].trim();
    }

    const [hours, minutes, seconds] =
      timePart.split(':').map(Number);

    return (
      days * 24 * 60 * 60 * 1000 +
      hours * 60 * 60 * 1000 +
      minutes * 60 * 1000 +
      seconds * 1000
    );
  }

  // =========================
  // EXISTING ACTIONS
  // =========================
  verifyAndClose() {
    this.modalService.open({
      title: 'Confirm Closure',
      message: 'Close this ticket permanently?',
      type: 'confirm',
      confirmText: 'Yes, Close'
    }, () => {
      this.ticketService.closeTicket(this.ticket!.id).subscribe({
        next: () => {
          this.modalService.open({
            title: 'Success',
            message: 'Ticket Closed.',
            type: 'success'
          });
          this.router.navigate(['/dit/history']);
        },
        error: () => {
          this.modalService.open({
            title: 'Error',
            message: 'Failed to close ticket.',
            type: 'error'
          });
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
          this.modalService.open({
            title: 'Error',
            message: 'Failed to reopen ticket.',
            type: 'error'
          });
          this.cd.detectChanges();
        }
      });
    });
  }
}
