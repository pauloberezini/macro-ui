import {Component, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';
import {AuthService, LoginRequest, LoginResponse} from '../../services/auth.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;
  resetPasswordForm: FormGroup;
  returnUrl: string = '/';
  infoMessage: string = '';
  isResetPasswordMode: boolean = false; // Toggle for reset password mode

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() private dialogRef: MatDialogRef<SignInComponent>, // Optional dialog reference
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      savePassword: [false]
    });

    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
      if (params['message']) {
        this.infoMessage = params['message'];
      }
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      const { email, password, savePassword } = this.signInForm.value;
      const credentials: LoginRequest = { email, password };

      this.authService.login(credentials).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful', response);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('token', response.token);
          localStorage.setItem('lastEmail', email);
          if (savePassword) {
            localStorage.setItem('lastPassword', password);
          } else {
            localStorage.removeItem('lastPassword');
          }

          // Close the dialog after successful login
          if (this.dialogRef) {
            this.dialogRef.close();
          }

          // Redirect to the return URL
          this.router.navigateByUrl(this.returnUrl).catch(err => console.error('Navigation Error:', err));
        },
        error: () => {
          this.infoMessage = "Login unsuccessful. Please check your credentials or join our partner network!";
        }
      });
    }
  }

  onResetPassword(): void {
    if (this.resetPasswordForm.valid) {
      const { email } = this.resetPasswordForm.value;

      // Execute the API call but ignore the response
      this.authService.requestPasswordReset(email).subscribe();

      // Always show this message, no matter what
      this.infoMessage = "If your email is registered, you will receive a reset link.";
      this.isResetPasswordMode = false; // Return to sign-in mode
    }
  }

  toggleResetPasswordMode(): void {
    this.isResetPasswordMode = !this.isResetPasswordMode;
    this.infoMessage = ''; // Clear messages when switching
  }
}
