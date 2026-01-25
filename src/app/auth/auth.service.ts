import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api/auth/';
  private userSubject = new BehaviorSubject<any>(null);

  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromStorage();
  }

  
  login(credentials: { identifier: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login/`, {
      identifier: credentials.identifier,
      password: credentials.password
    }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('user_data', JSON.stringify(response));
        }
        this.userSubject.next(response);
      })
    );
  }

  getRole(): string {
    const user = this.userSubject.value;
    return user?.role || '';
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
    }
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private loadUserFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        this.userSubject.next(JSON.parse(userData));
      }
    }
  }

  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('access_token');
    }
    return null;
  }
}
