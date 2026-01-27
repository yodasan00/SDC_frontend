import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  username: string;
  email: string;
  phone_number: string;
  password: string;
  role: string;
  department_name?: number | null;
  domain?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private baseUrl = 'http://127.0.0.1:8000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, data);
  }

  getDepartments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/departments/`);
  }

  getDomains(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/domains/`);
  }
}
