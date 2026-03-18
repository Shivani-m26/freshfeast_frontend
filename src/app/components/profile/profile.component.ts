import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
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

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.refreshProfile();
  }

  refreshProfile() {
    this.auth.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res;
        if (res.currentSubscription) {
          this.selectedPlanDetails = res.currentSubscription;
        }
      },
      error: () => this.profile = null
    });
  }

  showDetails(sub: any) {
    this.selectedPlanDetails = sub;
  }
}
