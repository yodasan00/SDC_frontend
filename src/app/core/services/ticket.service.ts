import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// ==========================================
// 1. INTERFACES (Matching Django Serializers)
// ==========================================

export interface TicketType {
  id: number;
  name: string;
}

export interface RequestType {
  id: number;
  name: string;
  ticket_type: number; // Foreign Key ID
}

export interface PriorityOption {
  code: string; // e.g., 'P1'
  label: string; // e.g., 'P1 - 30 Minutes'
}

export interface DomainOption {
  id: number;
  value: string;   // The slug (e.g., 'software') - Used for API payload
  display: string; // The label (e.g., 'Software Development') - Used for UI
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;        // PENDING, APPROVED, IN_PROGRESS, COMPLETED, CLOSED, REJECTED
  priority: string;      // P1, P2, P3, P4
  
  // Metadata (IDs returned by Serializer)
  ticket_type?: number;
  request_type?: number;
  affected_end_user?: string;
  ticket_type_name?: string; 
  request_type_name?: string;
  
  // Relations
  domain: number | null; // This might be an ID or null coming from backend
  domain_value?: string; // Optional: If you need the slug string
  created_by: number;
  created_by_name: string;
  
  attachment?: string | null;
  pm_remarks?: string;
  
  created_at: string;
  sla_time?: string;     // Duration string from backend
}

export interface DashboardStats {
  total_tickets?: number;
  pending?: number;
  approved?: number;
  rejected?: number;
  in_progress?: number;
  completed?: number;
  closed?: number;
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
  // 1. METADATA (Dropdowns)
  // ==========================================

  getTicketTypes(): Observable<TicketType[]> {
    return this.http.get<TicketType[]>(`${this.apiUrl}ticket-types/`);
  }

  // Fetch sub-categories based on selected Type ID
  getRequestTypes(ticketTypeId: number): Observable<RequestType[]> {
    let params = new HttpParams().set('ticket_type', ticketTypeId.toString());
    return this.http.get<RequestType[]>(`${this.apiUrl}request-types/`, { params });
  }

  getPriorities(): Observable<PriorityOption[]> {
    return this.http.get<PriorityOption[]>(`${this.apiUrl}ticket-priorities/`);
  }

  getDomains(): Observable<DomainOption[]> {
    return this.http.get<DomainOption[]>(`${this.apiUrl}domains/`);
  }

  // ==========================================
  // 2. DEPARTMENT USER ACTIONS
  // ==========================================

  createTicket(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}create/`, formData);
  }

  getMyTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}my-tickets/`);
  }

  getDepartmentStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}dashboard/department/`);
  }

  // ==========================================
  // 3. PROJECT MANAGER (DIT) ACTIONS
  // ==========================================

  getPendingTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}pending/`);
  }

  /**
   * Approves a ticket.
   * @param id Ticket ID
   * @param domainValue The 'value' field from DomainOption (e.g., 'software'), NOT the ID.
   * @param priority The selected priority code (e.g., 'P1').
   * @param remarks Optional remarks.
   */
  approveAndForward(id: number, domainValue: string, priority: string, remarks: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/approve/`, { 
      domain: domainValue, 
      priority: priority, 
      remarks: remarks 
    });
  }

  rejectTicket(id: number, remarks: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/reject/`, { remarks });
  }

  // Final Close Action (Lifecycle End) - PM Only
  closeTicket(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/close/`, {});
  }

  reopenTicket(id: number, remarks: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/reopen/`, { remarks });
  }

  getDitStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}dashboard/dit/`);
  }

  getDitHistory(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}dit/history/`);
  }

  // ==========================================
  // 4. SDC USER ACTIONS
  // ==========================================

  getSdcInbox(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}approved/`);
  }

  getSdcInProgressTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}in-progress/`);
  }

  startTicket(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/start/`, {});
  }

  completeTicket(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/complete/`, {});
  }

  revertTicket(id: number, remarks: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/revert/`, { remarks });
  }

  // Log Progress (Updates logs without changing status)
  logProgress(id: number, remarks: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/log-progress/`, { remarks });
  }

  getSdcStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}dashboard/sdc/`);
  }

  getSdcHistory(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}sdc/history/`);
  }

  // ==========================================
  // 5. SHARED & OFFICERS
  // ==========================================

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}${id}/`);
  }

  getAllTicketsForOfficer(search: string = ''): Observable<Ticket[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    return this.http.get<Ticket[]>(`${this.apiUrl}officer/all/`, { params });
  }

  getOfficerStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}officer/stats/`);
  }

  getComments(ticketId: number): Observable<TicketComment[]> {
    return this.http.get<TicketComment[]>(`${this.apiUrl}${ticketId}/comments/`);
  }

  addComment(ticketId: number, comment: string): Observable<TicketComment> {
    return this.http.post<TicketComment>(`${this.apiUrl}${ticketId}/comments/add/`, { comment });
  }

  getAuditLogs(ticketId: number): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}${ticketId}/audit-log/`);
  }

  // ==========================================
  // 6. HELPER: SLA Calculator (Frontend Visuals)
  // ==========================================
  
  // Returns SLA duration in hours based on Priority Code
  // This matches the Backend 'PRIORITY_SLA_MAP'
  getSlaHours(priority: string): number {
    switch (priority) {
      case 'P1': return 0.5; // 30 Mins
      case 'P2': return 2;   // 2 Hours
      case 'P3': return 24;  // 1 Day
      case 'P4': return 48;  // 2 Days
      default: return 24;
    }
  }

  // Inside MyTicketsComponent class

getStatusClass(status: string): string {
  if (!status) return '';
  return status.toUpperCase().replace('_', '-'); 
}
}