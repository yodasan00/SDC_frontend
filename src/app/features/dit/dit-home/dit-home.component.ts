import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, DashboardStats } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-dit-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dit-home.component.html',
  styleUrls: ['./dit-home.component.css']
})
export class DitHomeComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = true;
  currentDate = new Date();

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.ticketService.getDitStats().subscribe({
      next: (data) => {
        console.log('DIT Stats Loaded:', data);
        this.stats = data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load DIT stats:', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }
}