import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent {
  step = 1;
  selectedPlan = '';
  protein = '50g';
  numMeals = 1;
  freq = 'ALL';
  timings = { breakfast: '08:00', lunch: '13:00', dinner: '20:00' };

  customData = {
    height: 170,
    weight: 70,
    preference: 'VEG',
    goal: 'WEIGHT_LOSS',
    healthIssues: [] as string[]
  };

  healthList = [
    'PCOS', 'PCOD', 'Indigestion', 'Constipation', 'Lactose Intolerance', 
    'Gluten Intolerance', 'Curd Allergy', 'Milk Allergy', 'Thyroid', 'Gut Issues', 'Overweight'
  ];

  analysis: any = null;

  constructor(
    private planService: PlanService, 
    public auth: AuthService,
    private router: Router
  ) {}

  selectPlan(plan: string) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/signup']);
      return;
    }
    this.selectedPlan = plan;
    this.step = 2;
  }

  toggleHealth(issue: string) {
    if (this.customData.healthIssues.includes(issue)) {
      this.customData.healthIssues = this.customData.healthIssues.filter(i => i !== issue);
    } else {
      this.customData.healthIssues.push(issue);
    }
  }

  analyzePlan() {
    const user = this.auth.currentUser();
    // Fallback if profile is incomplete
    const age = (user && user.dateOfBirth) ? this.calculateAge(user.dateOfBirth) : 25;
    const gender = (user && user.gender) ? user.gender : 'MALE';
    
    const request = {
      ...this.customData,
      age: age,
      gender: gender
    };

    this.planService.calculateCalories(request).subscribe({
      next: (res) => {
        this.analysis = res;
      },
      error: (err) => {
        console.error('Nutrition calculation failed', err);
        alert('Could not calculate nutrition. Please check your inputs.');
      }
    });
  }

  calculateAge(dob: string) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }

  calculatePrice() {
    let base = 50; 
    let days = this.freq === 'ALL' ? 30 : (this.freq === 'WEEKDAYS' ? 22 : 8);
    
    if (this.selectedPlan === 'PRO') {
      if (this.protein === '50g') base = 100;
      else if (this.protein === '100g') base = 120;
      else if (this.protein === '150g') base = 150;
      else base = 200;
    } else if (this.selectedPlan === 'CUSTOMIZED') {
      base = 150 + (this.customData.healthIssues.length * 20);
    }

    return base * this.numMeals * days;
  }

  onProceed() {
    const selection = {
      planType: this.selectedPlan,
      proteinAmount: this.protein,
      mealsPerDay: this.numMeals,
      frequency: this.freq,
      weight: this.customData.weight,
      height: this.customData.height,
      goal: this.customData.goal,
      preference: this.customData.preference,
      healthIssues: this.customData.healthIssues,
      timings: this.timings
    };
    
    this.planService.selectedPlan.set(selection);
    this.router.navigate(['/order-details']);
  }
}
