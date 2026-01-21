import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TicketService, Ticket } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-sdc-workspace',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sdc-workspace.component.html',
  styleUrls: ['./sdc-workspace.component.css']
})
export class SdcWorkspaceComponent implements OnInit {
  ticket: Ticket | null = null;
  isLoading = true;
  isProcessing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService,
    private cd: ChangeDetectorRef // <--- Injected
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTicket(id);
  }

  loadTicket(id: number) {
    this.isLoading = true;
    this.ticketService.getTicketById(id).subscribe({
      next: (t) => {
        this.ticket = t;
        this.isLoading = false;
        this.cd.detectChanges(); // <--- Force Update
      },
      error: () => {
        alert("Ticket not found");
        this.router.navigate(['/sdc/inbox']);
      }
    });
  }

  startWork() {
    if(!confirm('Start working on this ticket?')) return;
    
    this.isProcessing = true;
    this.cd.detectChanges(); // Disable button

    this.ticketService.startTicket(this.ticket!.id).subscribe({
      next: () => {
        alert('Work Started!');
        // Reload to update status (Approved -> In Progress)
        this.loadTicket(this.ticket!.id);
        this.isProcessing = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.isProcessing = false;
        this.cd.detectChanges();
      }
    });
  }

  completeWork() {
    if(!confirm('Mark this ticket as COMPLETED?')) return;
    
    this.isProcessing = true;
    this.cd.detectChanges();

    this.ticketService.completeTicket(this.ticket!.id).subscribe({
      next: () => {
        alert('Ticket Completed Successfully!');
        this.router.navigate(['/sdc/pending']);
      },
      error: () => {
        this.isProcessing = false;
        this.cd.detectChanges();
      }
    });
  }

  revertWork() {
  const reason = prompt("Please state why you are reverting this ticket (e.g., 'Wrong Domain'):");
  
  if (!reason) return;

  if(!confirm('Send this ticket back to the Project Manager?')) return;

  this.isProcessing = true;
  this.cd.detectChanges();

  this.ticketService.revertTicket(this.ticket!.id, reason).subscribe({
    next: () => {
      alert('Ticket Reverted to PM.');
      this.router.navigate(['/sdc/pending']); // Go back to inbox
    },
    error: (err) => {
      alert('Failed to revert ticket.');
      this.isProcessing = false;
      this.cd.detectChanges();
    }
  });
}
}