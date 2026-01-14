import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // <--- Import these
import { isPlatformBrowser } from '@angular/common';             // <--- Import this
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Update with your actual Django URL
  private apiUrl = 'http://127.0.0.1:8000/api/auth/';
  private userSubject = new BehaviorSubject<any>(null);
  
  // 1. Inject PLATFORM_ID to check where we are running
  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    this.loadUserFromStorage();
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login/`, credentials).pipe(
      tap(response => {
        // 2. Only save to localStorage if we are in the Browser
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('user_data', JSON.stringify(response));
        }
        this.userSubject.next(response);
      })
    );
  }

  private loadUserFromStorage() {
    // 3. Only read from localStorage if we are in the Browser
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        this.userSubject.next(JSON.parse(userData));
      }
    }
  }

  getToken() {
    // 4. Safe check for token
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
}