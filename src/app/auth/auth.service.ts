import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // <--- Import these
import { isPlatformBrowser } from '@angular/common';             // <--- Import this
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/';
  private userSubject = new BehaviorSubject<any>(null);
  

  constructor(
    private http: HttpClient, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    this.loadUserFromStorage();
  }

  user$ = this.userSubject.asObservable();

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login/`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('user_data', JSON.stringify(response));
        }
        this.userSubject.next(response);
      })
    );
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