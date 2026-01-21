import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Import ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { 
  TicketService, 
  Ticket, 
  TicketComment, 
  AuditLog 
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
    // console.log('Injected AuthService:', this.authService);
    // this.authService.user$.subscribe(user => {
    // this.currentUserRole = user?.role ?? '';
    // });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadData(id);
    } else {
      this.isLoading = false;
    }
  }

  loadData(id: number): void {
    this.isLoading = true;
    
    // 1. Fetch Ticket (MAIN DATA)
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        console.log('Ticket loaded:', data);
        
        // 3. STOP LOADING IMMEDIATELY when ticket arrives
        this.isLoading = false; 
        this.cd.detectChanges(); // Force screen update
      },
      error: (err) => {
        console.error('Error fetching ticket:', err);
        this.isLoading = false; 
        this.cd.detectChanges();
      }
    });

    // 2. Fetch Comments (Background)
    this.ticketService.getComments(id).subscribe({
      next: (data) => {
        this.comments = data;
        this.cd.detectChanges(); // Update when comments arrive
      },
      error: (err) => console.error('Error fetching comments:', err)
    });

    // 3. Fetch Audit Logs (Background)
    this.ticketService.getAuditLogs(id).subscribe({
      next: (data) => {
        this.logs = data;
        this.cd.detectChanges(); // Update when logs arrive
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
        this.cd.detectChanges(); // Update list instantly
      },
      error: (err) => alert('Could not post comment.')
    });
  }
}