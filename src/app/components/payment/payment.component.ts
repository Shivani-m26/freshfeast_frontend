import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlanService } from '../../services/plan.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  subscriptionId: number = 0;
  paymentMethod = 'card';
  cardDetails = { cardNumber: '', expiry: '', cvv: '', name: '' };
  upiId = '';
  netBankingBank = '';
  captchaCode = '';
  userCaptchaInput = '';
  processing = false;
  paymentSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptionId = Number(this.route.snapshot.paramMap.get('subscriptionId'));
    if (!this.subscriptionId) {
      this.router.navigate(['/plans']);
    }
    this.generateCaptcha();
  }

  generateCaptcha() {
    this.captchaCode = Math.random().toString(36).substring(2, 7).toUpperCase();
  }

  processPayment() {
    if (!this.userCaptchaInput || this.userCaptchaInput.toUpperCase() !== this.captchaCode) {
      alert('Invalid Captcha! Please try again.');
      this.generateCaptcha();
      this.userCaptchaInput = '';
      return;
    }

    if (!this.subscriptionId) {
       alert('Invalid session. Please restart checkout.');
       this.router.navigate(['/plans']);
       return;
    }

    this.processing = true;
    setTimeout(() => {
      const mockRef = 'PAY-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      this.planService.confirmPayment(this.subscriptionId, mockRef).subscribe({
        next: (res: any) => {
          this.processing = false;
          this.paymentSuccess = true;
          // After showing success popup for 3 seconds
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 3000);
        },
        error: (err: any) => {
          this.processing = false;
          console.error('Payment confirmation error', err);
          alert('Payment verification failed on the server. Please try again.');
        }
      });
    }, 2000);
  }
}
