import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, Ticket } from '../../../core/services/ticket.service';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../../core/services/modal.service';

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
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadActiveTasks();
  }

  // =========================
  // 🔒 API PART (UNCHANGED)
  // =========================
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

        this.modalService.open({
          title: 'Connection Error',
          message: 'Failed to load active tasks.',
          type: 'error'
        });
      }
    });
  }

  // =========================
  // ✅ SMALL ADDITION ONLY
  // =========================
  isOverdue(ticket: any): boolean {
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
}
