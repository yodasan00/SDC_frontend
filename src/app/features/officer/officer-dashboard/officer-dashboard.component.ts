import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- Import
import { CommonModule } from '@angular/common';
import { TicketService, DashboardStats } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './officer-dashboard.component.html',
  styleUrls: ['./officer-dashboard.component.css']
})
export class OfficerDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = true;

  constructor(
    private ticketService: TicketService,
    private cd: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.ticketService.getOfficerStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        this.cd.detectChanges(); 
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cd.detectChanges(); 
      }
    });
  }
}