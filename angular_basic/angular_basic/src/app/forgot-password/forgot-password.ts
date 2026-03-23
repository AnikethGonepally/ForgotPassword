import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPasswordComponent {

  identifier = '';
  otp = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  // ✅ SEND OTP
  sendOtp() {
    this.errorMessage = '';

    if (!this.identifier) {
      this.errorMessage = 'Enter email or mobile';
      return;
    }

    localStorage.setItem('identifier', this.identifier);

    this.auth.forgotPassword(this.identifier).subscribe({
      next: () => {
        alert('OTP Sent Successfully');
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  // ✅ VERIFY OTP
  verifyOtp() {
    this.errorMessage = '';

    if (!this.otp) {
      this.errorMessage = 'Enter OTP';
      return;
    }

    this.auth.verifyOtp(this.identifier, this.otp).subscribe({
      next: () => {
        this.router.navigate(['/reset-password']);
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }
}