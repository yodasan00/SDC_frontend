import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService, Ticket, DomainOption } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-dit-approval',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dit-approval.component.html',
  styleUrls: ['./dit-approval.component.css']
})
export class DitApprovalComponent implements OnInit {
  ticket: Ticket | null = null;
  domains: DomainOption[] = [];
  
  selectedDomain: string = '';
  remarks: string = '';
  
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
    this.loadData(id);
  }

  loadData(id: number) {
    // 1. Load Ticket
    this.ticketService.getTicketById(id).subscribe({
      next: (t) => {
        this.ticket = t;
        this.isLoading = false;
        this.cd.detectChanges(); // <--- Force Update
      },
      error: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });

    // 2. Load Domains
    this.ticketService.getDomains().subscribe({
      next: (d) => {
        this.domains = d;
        this.cd.detectChanges(); // <--- Force Update
      }
    });
  }

  approve() {
    if (!this.selectedDomain) {
      alert('Please select a Technical Domain.');
      return;
    }
    if (!confirm('Approve and Forward this ticket?')) return;

    this.isProcessing = true;
    this.cd.detectChanges(); // Show disabled state

    this.ticketService.approveAndForward(this.ticket!.id, this.selectedDomain, this.remarks).subscribe({
      next: () => {
        alert('Ticket Approved!');
        this.router.navigate(['/dit/pending']);
      },
      error: (err) => {
        alert('Error approving ticket');
        this.isProcessing = false;
        this.cd.detectChanges(); // Re-enable buttons
      }
    });
  }

  reject() {
    if (!this.remarks && !confirm('Reject without remarks? We recommend adding a reason.')) return;
    
    this.isProcessing = true;
    this.cd.detectChanges();

    this.ticketService.rejectTicket(this.ticket!.id, this.remarks).subscribe({
      next: () => {
        alert('Ticket Rejected.');
        this.router.navigate(['/dit/pending']);
      },
      error: () => {
        alert('Error rejecting ticket');
        this.isProcessing = false;
        this.cd.detectChanges();
      }
    });
  }
}