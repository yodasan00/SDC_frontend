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
}

export interface DashboardStats {
  total_tickets: number;
  pending: number;
  approved: number;
  rejected: number;
  in_progress: number;
  completed: number;
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
}