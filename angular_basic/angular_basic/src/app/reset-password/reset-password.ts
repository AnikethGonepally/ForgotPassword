import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPasswordComponent {

  newPassword = '';
  confirmPassword = '';
  message = '';

  identifier = localStorage.getItem('identifier') || '';

  constructor(private auth: AuthService, private router: Router) {}

  updatePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.message = 'Please fill all fields';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    this.auth.resetPassword(this.identifier, this.newPassword).subscribe({
      next: () => {
        alert('Password updated successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.message = err;
      }
    });
  }
}