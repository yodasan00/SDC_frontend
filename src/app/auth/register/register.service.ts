import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  role: string;
  department_name?: string;
  domain?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private baseUrl = 'http://localhost:8000/api/auth/';

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(this.baseUrl + 'register/', data).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error) {
          errorMessage = JSON.stringify(error.error);
        } else if (error.status) {
          errorMessage = `Server Error: ${error.status}`;
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // ---------------- GET DEPARTMENTS ----------------
  getDepartments(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + 'departments/');
  }

  // ---------------- GET DOMAINS ----------------
  getDomains(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + 'domains/');
  }
}
