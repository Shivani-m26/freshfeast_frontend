import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupData = {
    email: '',
    username: '',
    password: '',
    fullName: '',
    gender: 'MALE',
    dateOfBirth: ''
  };
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSignup() {
    this.loading = true;
    this.auth.register(this.signupData).subscribe({
      next: () => this.router.navigate(['/plans']),
      error: (err) => {
        alert('Registration failed. Username or email might be taken.');
        this.loading = false;
      }
    });
  }
}
