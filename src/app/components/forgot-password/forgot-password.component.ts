import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  token = '';
  newPassword = '';
  tokenGenerated = '';

  constructor(private auth: AuthService, private router: Router) {}

  onRequestReset() {
    this.auth.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        // In this implementation, the backend returns the token in the response for demo
        this.tokenGenerated = res.text || 'MOCK_TOKEN_XYZ';
        alert('Reset link generated!');
      },
      error: () => alert('Email not found.')
    });
  }

  onReset() {
    this.auth.resetPassword({ token: this.tokenGenerated, newPassword: this.newPassword }).subscribe({
      next: () => {
        alert('Password reset successful!');
        this.router.navigate(['/login']);
      },
      error: () => alert('Reset failed.')
    });
  }
}
