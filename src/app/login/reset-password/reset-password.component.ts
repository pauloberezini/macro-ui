import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  infoMessage: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Get token from URL (for password reset confirmation)
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.token = params['token'];
      }
    });
  }

  onSubmit(): void {
    let apiCall;

    if (this.token) {
      const newPassword = this.resetPasswordForm.get('newPassword')?.value || '';
      if (!newPassword) {
        this.infoMessage = "If your email is registered, you will receive a password reset link.";
        return;
      }
      apiCall = this.authService.confirmResetPassword(this.token, newPassword);
    } else {
      const email = this.resetPasswordForm.get('email')?.value || '';
      if (!email) {
        this.infoMessage = "If your email is registered, you will receive a password reset link.";
        return;
      }
      apiCall = this.authService.requestPasswordReset(email);
    }

    apiCall.subscribe({
      next: (response) => {
        this.infoMessage = response + '  Redirecting...';
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Password reset error:', err);
      }
    });


    // ✅ Always show this message, no matter what
    this.infoMessage = "If your email is registered, you will receive a password reset link.";
  }

}
