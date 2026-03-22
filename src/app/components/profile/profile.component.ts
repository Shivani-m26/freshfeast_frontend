import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PlanService } from '../../services/plan.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  selectedPlanDetails: any = null;

  constructor(
    public auth: AuthService,
    private planService: PlanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.refreshProfile();
  }

  refreshProfile() {
    this.auth.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res;
        if (!this.selectedPlanDetails && res.currentSubscription) {
          this.selectedPlanDetails = res.currentSubscription;
        }
      },
      error: () => this.profile = null
    });
  }

  showDetails(sub: any) {
    this.selectedPlanDetails = sub;
  }

  cancelPlan(id: number) {
    if (confirm('Are you sure you want to cancel and delete this subscription?')) {
      this.planService.cancelSubscription(id).subscribe({
        next: () => {
          alert('Subscription cancelled successfully!');
          this.selectedPlanDetails = null;
          this.refreshProfile();
        },
        error: (err: any) => {
          console.error('Cancel error:', err);
          const rootCause = err.error?.message || 'Server error';
          alert('Cancellation failed: ' + rootCause);
        }
      });
    }
  }

  goToPayment(id: number) {
    this.router.navigate(['/payment', id]);
  }
}
