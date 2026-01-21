import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  domain: string;
  attachment?: string; // URL to the file
  pm_remarks?: string;
  created_at: string;
  created_by: number;
  created_by_name?: string;
  department_name?: string;
}

// For dynamic dropdowns in DIT view
export interface DomainOption {
  code: string;
  label: string;
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
  user: string;        
  comment: string;  
  created_at: string;
}

export interface AuditLog {
  id: number;
  ticket: number;
  user: string;        
  action: string;
  old_status?: string;
  new_status?: string;
  timestamp: string;
  remarks?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://127.0.0.1:8000/api/tickets/';

  constructor(private http: HttpClient) { }

  // ==========================================
  // 1. SHARED (Details, Comments, Logs)
  // ==========================================
  
  getDomains(): Observable<DomainOption[]> {
    return this.http.get<DomainOption[]>(`${this.apiUrl}domains/`);
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}${id}/`);
  }

  getComments(ticketId: number): Observable<TicketComment[]> {
    return this.http.get<TicketComment[]>(`${this.apiUrl}${ticketId}/comments/`);
  }

  addComment(ticketId: number, commentText: string): Observable<TicketComment> {
    return this.http.post<TicketComment>(`${this.apiUrl}${ticketId}/comments/add/`, { comment: commentText });
  }

  getAuditLogs(ticketId: number): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}${ticketId}/audit-log/`);
  }

  // ==========================================
  // 2. DEPARTMENT USER
  // ==========================================
  getDepartmentStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}dashboard/department/`);
  }
  
  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}my-tickets/`);
  }

  createTicket(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}create/`, formData);
  }

  // ==========================================
  // 3. PROJECT MANAGER (DIT)
  // ==========================================

  getDitStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}dashboard/dit/`);
  }

  getPendingTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}pending/`);
  }

  approveAndForward(id: number, domain: string, remarks: string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/approve/`, { domain, remarks });
  }

  rejectTicket(id: number, remarks: string = ''): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/reject/`, { remarks });
  }

  getDitHistory(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}dit/history/`);
  }

  // ==========================================
  // 4. SDC USER
  // ==========================================

  getSdcStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}dashboard/sdc/`);
  }
  
  // "Inbox" - Approved tickets assigned to this user's domain
  getSdcInbox(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}approved/`);
  }

  // "Active" - Tickets currently being worked on
  getSdcInProgressTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}in-progress/`);
  }

  startTicket(ticketId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${ticketId}/start/`, {});
  }
  
  completeTicket(ticketId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${ticketId}/complete/`, {});
  }
  revertTicket(id: number, remarks: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/revert/`, { remarks });
  }

  getSdcHistory(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}sdc/history/`);
  }

  // ==========================================
  // 5. OFFICER (AUDIT)
  // ==========================================

  getAllTicketsForOfficer(search: string = ''): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}officer/all/?search=${search}`);
  }

  getOfficerStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}officer/stats/`);
  }
}