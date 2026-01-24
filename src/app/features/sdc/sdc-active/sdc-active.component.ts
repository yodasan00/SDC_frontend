import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService, Ticket } from '../../../core/services/ticket.service';
import { RouterLink } from '@angular/router';
import { ModalService } from '../../../core/services/modal.service'; // <--- Import

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
    private modalService: ModalService // <--- Inject
  ) {}

  ngOnInit() {
    this.loadActiveTasks();
  }

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
}