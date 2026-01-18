import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, DashboardStats } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-sdc-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sdc-home.component.html',
  styleUrls: ['./sdc-home.component.css']
})
export class SdcHomeComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = true;

  constructor(private ticketService: TicketService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.ticketService.getSdcStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => { console.error(err); this.isLoading = false; this.cd.detectChanges(); }
    });
  }
}