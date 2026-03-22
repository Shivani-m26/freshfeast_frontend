import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { config } from '../app.config.base';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private apiUrl = `${config.apiUrl}/subscriptions`;
  
  // To store state during the checkout process
  selectedPlan = signal<any>(null);

  constructor(private http: HttpClient, private auth: AuthService) {}

  getHeaders() {
    const token = this.auth.currentUser()?.token;
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  createSubscription(data: any) {
    return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
  }

  confirmPayment(id: number, paymentRef: string) {
    return this.http.post(`${this.apiUrl}/${id}/confirm-payment`, null, {
      headers: this.getHeaders(),
      params: { paymentRef }
    });
  }

  calculateCalories(data: any) {
    return this.http.post(`${config.apiUrl}/calculate`, data, { headers: this.getHeaders() });
  }

  cancelSubscription(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
