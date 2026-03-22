import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanService } from '../../services/plan.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-bmi-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './bmi-calculator.component.html',
  styleUrls: ['./bmi-calculator.component.css']
})
export class BmiCalculatorComponent {
  calcData: any = {
    gender: 'MALE',
    age: null,
    height: null,
    weight: null,
    goal: 'MAINTAIN'
  };

  result: any = null;

  constructor(private planService: PlanService) {}

  calculate() {
    this.planService.calculateCalories(this.calcData).subscribe(res => {
      this.result = res;
    });
  }

  getMarkerPos() {
    if (!this.result) return 0;
    const bmi = this.result.bmi;
    // Map BMI 15-40 to 0-100%
    let pos = ((bmi - 15) / (40 - 15)) * 100;
    return Math.min(Math.max(pos, 0), 100);
  }
}
