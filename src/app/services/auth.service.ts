import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  
  currentUser = signal<any>(null);

  constructor(private http: HttpClient, private router: Router) { // Injected Router
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  getProfile() {
    const token = this.currentUser()?.token;
    const headers = { 'Authorization': `Bearer ${token}` };
    return this.http.get('http://localhost:8080/api/profile', { headers });
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((res: any) => this.setSession(res))
    );
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => this.setSession(res))
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  private setSession(authRes: any) {
    localStorage.setItem('user', JSON.stringify(authRes));
    this.currentUser.set(authRes);
  }

  isLoggedIn() {
    return !!this.currentUser();
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/forgot-password`, null, { 
      params: { email },
      responseType: 'text'
    });
  }

  resetPassword(data: any) {
    return this.http.post(`${this.apiUrl}/reset-password`, null, { 
      params: data,
      responseType: 'text'
    });
  }
}
