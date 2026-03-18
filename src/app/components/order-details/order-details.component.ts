import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  cities = [
    { name: 'Chennai', pin: '600001' },
    { name: 'Coimbatore', pin: '641001' },
    { name: 'Bangalore', pin: '560001' },
    { name: 'Hyderabad', pin: '500001' },
    { name: 'Delhi', pin: '110001' },
    { name: 'Mumbai', pin: '400001' },
    { name: 'Calcutta', pin: '700001' }
  ];

  countries = [
    { name: 'India', code: '+91' },
    { name: 'USA', code: '+1' },
    { name: 'UK', code: '+44' },
    { name: 'Canada', code: '+1' },
    { name: 'Australia', code: '+61' }
  ];

  orderDetails = {
    fullName: '',
    deliveryAddress: '',
    contactPrefix: '+91',
    contactNumber: '',
    city: '',
    pincode: ''
  };

  selectedPlan: any;

  constructor(
    private planService: PlanService, 
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.selectedPlan = this.planService.selectedPlan();
    if (!this.selectedPlan) {
      this.router.navigate(['/plans']);
      return;
    }

    this.auth.getProfile().subscribe((profile: any) => {
      if (profile) {
        this.orderDetails.fullName = profile.fullName;
        this.orderDetails.contactNumber = profile.phoneNumber || '';
        // If they had an address, try to prefill city if it's in our list
        if (profile.address) {
          const parts = profile.address.split(', ');
          this.orderDetails.deliveryAddress = parts[0] || '';
          if (parts.length > 1) {
             const cityMatch = this.cities.find(c => parts[1].includes(c.name));
             if (cityMatch) {
               this.orderDetails.city = cityMatch.name;
               this.orderDetails.pincode = cityMatch.pin;
             }
          }
        }
      }
    });
  }

  onCityChange() {
    const cityData = this.cities.find(c => c.name === this.orderDetails.city);
    if (cityData) {
      this.orderDetails.pincode = cityData.pin;
    }
  }

  onSubmit() {
    if (!this.orderDetails.city || !this.orderDetails.pincode) {
      alert('Please select a city and verify pincode.');
      return;
    }

    const fullData = {
      ...this.selectedPlan,
      deliveryAddress: `${this.orderDetails.deliveryAddress}, ${this.orderDetails.city} - ${this.orderDetails.pincode}`,
      contactNumber: `${this.orderDetails.contactPrefix} ${this.orderDetails.contactNumber}`
    };

    console.log('Placing Order:', fullData);
    this.planService.createSubscription(fullData).subscribe({
      next: (res: any) => {
        console.log('Order successful:', res);
        if (res && res.id) {
          this.router.navigate(['/payment', res.id]);
        } else {
          console.error('Subscription ID missing from response:', res);
          alert('System error: Subscription ID not generated. Please contact support.');
        }
      },
      error: (err) => {
        console.error('Order error:', err);
        alert('Subscription creation failed. This might be due to missing details or server validation.');
      }
    });
  }
}
