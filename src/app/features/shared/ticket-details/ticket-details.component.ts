import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

import { 
  TicketService, 
  Ticket, 
  TicketComment, 
  AuditLog,
  DomainOption // <--- 1. Import DomainOption
} from '../../../core/services/ticket.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {
  ticket: Ticket | null = null;
  comments: TicketComment[] = [];
  logs: AuditLog[] = [];
  
  // 2. Add Domains List
  domains: DomainOption[] = [];
  
  currentUserRole: string = '';
  newCommentText: string = '';
  activeTab: string = 'comments';
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private cd: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();
    this.activeTab = 'logs'; 
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    // 3. Load Metadata (Domains) on Init
    this.loadMetadata();

    if (id) {
      this.loadData(id);
    } else {
      this.isLoading = false;
    }
  }

  // 4. Fetch Domain List
  loadMetadata() {
    this.ticketService.getDomains().subscribe(data => {
      this.domains = data;
      this.cd.detectChanges();
    });
  }

  // 5. Helper Function for HTML to translate ID -> Name
  getDomainName(id: number): string {
    const match = this.domains.find(d => d.id === id);
    return match ? match.display : 'Unknown Domain';
  }

  loadData(id: number): void {
    this.isLoading = true;
    
    // 1. Fetch Ticket
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.isLoading = false; 
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching ticket:', err);
        this.isLoading = false; 
        this.cd.detectChanges();
      }
    });

    // 2. Fetch Comments
    this.ticketService.getComments(id).subscribe({
      next: (data) => {
        this.comments = data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching comments:', err)
    });

    // 3. Fetch Audit Logs
    this.ticketService.getAuditLogs(id).subscribe({
      next: (data) => {
        this.logs = data;
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching logs:', err)
    });
  }

  postComment(): void {
    if (!this.newCommentText.trim() || !this.ticket) return;

    this.ticketService.addComment(this.ticket.id, this.newCommentText).subscribe({
      next: (newComment) => {
        this.comments.push(newComment);
        this.newCommentText = '';
        this.cd.detectChanges();
      },
      error: (err) => alert('Could not post comment.')
    });
  }
}