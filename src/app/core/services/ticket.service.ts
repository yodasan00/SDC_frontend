import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  created_by: number;

  // ✅ ADD THESE (do not remove anything)
  created_by_name?: string;
  department_name?: string;
}


export interface DashboardStats {
  total_tickets: number;
  pending: number;
  approved: number;
  rejected: number;
  in_progress: number;
  completed: number;
}

export interface TicketComment {
  id: number;
  ticket: number;
  user: any;        // 'user' might be an ID (number) or name (string) depending on your Serializer
  comment: string;  // <--- WAS 'text', NOW 'comment' (Matches Django)
  created_at: string;
}

export interface AuditLog {
  id: number;
  ticket: number;
  user: any;        
  action: string;
  old_status?: string;
  new_status?: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://127.0.0.1:8000/api/tickets/';

  constructor(private http: HttpClient) { }

  // 1. Get Dashboard Stats
  getDepartmentStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}dashboard/department/`);
  }

  // 2. Get My Tickets
  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}my-tickets/`);
  }

  // 3. Create Ticket (We will use this later)
  createTicket(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}create/`, data);
  }

  getDitStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}dashboard/dit/`);
  }

  getPendingTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}pending/`);
  }

  // 2. Approve a Ticket
  approveTicket(ticketId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${ticketId}/approve/`, {});
  }

  // 3. Reject a Ticket
  rejectTicket(ticketId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${ticketId}/reject/`, {});
  }

  getDitHistory(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}dit/history/`);
  }


  // --- SDC SERVICES ---

  // 1. Get SDC Stats
  getSdcStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}dashboard/sdc/`);
  }

  // 2. Get Tickets ready for SDC (Approved by DIT)
  getSdcApprovedTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}approved/`);
  }

  getSdcInProgressTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}in-progress/`);
  }

  // 3. Start Work (Mark as In Progress)
  startTicket(ticketId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${ticketId}/start/`, {});
  }

  // 4. Complete Work (Mark as Completed)
  completeTicket(ticketId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${ticketId}/complete/`, {});
  }

  getSdcHistory(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}sdc/history/`);
  }

  // --- COMMENTS & LOGS METHODS (Updated URLs) ---
  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}${id}/`);
  }

  getComments(ticketId: number): Observable<TicketComment[]> {
    return this.http.get<TicketComment[]>(`${this.apiUrl}${ticketId}/comments/`);
  }

  addComment(ticketId: number, commentText: string): Observable<TicketComment> {
    return this.http.post<TicketComment>(`${this.apiUrl}${ticketId}/comments/add/`,{ comment: commentText });
  }

  getAuditLogs(ticketId: number): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}${ticketId}/audit-log/`);
  }

}