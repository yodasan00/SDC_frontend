import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-sdc-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sdc-history.component.html',
  styleUrls: ['./sdc-history.component.css']
})
export class SdcHistoryComponent implements OnInit {

  historyTickets: Ticket[] = [];
  isLoading = true;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadHistory();
  }

  // =========================
  // 🔒 API PART (UNCHANGED)
  // =========================
  loadHistory() {
    this.isLoading = true;
    this.ticketService.getSdcHistory().subscribe({
      next: (data) => {
        this.historyTickets = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  // =========================
  // ✅ SLA CHECK (SMALL ADD)
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
