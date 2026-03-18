import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  facts = [
    { icon: '🧠', title: 'Mental Clarity', description: 'Balanced meals provide the glucose your brain needs to stay sharp and focused throughout the day.' },
    { icon: '⚡', title: 'Steady Energy', description: 'Avoid the sugar crash. Complex carbs and proteins give you sustained energy for hours.' },
    { icon: '🛡️', title: 'Immunity Boost', description: 'Vitamins and minerals from fresh vegetables strengthen your natural defenses.' },
    { icon: '💪', title: 'Muscle Recovery', description: 'Our protein-rich pro plans ensure your muscles recover faster after your workout.' }
  ];

  currentFact = 0;
  interval: any;

  ngOnInit() {
    this.interval = setInterval(() => this.next(), 5000);
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  next() {
    this.currentFact = (this.currentFact + 1) % this.facts.length;
  }

  prev() {
    this.currentFact = (this.currentFact - 1 + this.facts.length) % this.facts.length;
  }
}
