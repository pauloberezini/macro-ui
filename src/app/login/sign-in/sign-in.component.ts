import {Component, OnInit, Optional} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService, LoginRequest, LoginResponse } from "../../services/auth.service";
import { MatCheckboxModule } from "@angular/material/checkbox";

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
  ],
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<SignInComponent>, // Mark as optional
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Retrieve previously saved values, if any.
    const lastEmail = localStorage.getItem('lastEmail') || '';
    const lastPassword = localStorage.getItem('lastPassword') || '';
    const savePassword = !!lastPassword; // true if a password exists

    this.signInForm = this.fb.group({
      email: [lastEmail, [Validators.required, Validators.email]],
      password: [savePassword ? lastPassword : '', Validators.required],
      savePassword: [savePassword]  // Checkbox control for "Save Password"
    });
  }

  onSubmit(): void {
    if (this.signInForm.valid) {
      // Destructure the form value
      const { email, password, savePassword } = this.signInForm.value;
      // Create an object that conforms to LoginRequest
      const credentials: LoginRequest = { email, password };

      console.log('Sign in data:', { email, password, savePassword });

      // Call the login API with the credentials only
      this.authService.login(credentials).subscribe({
        next: (response: LoginResponse) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('lastEmail', email);
          if (savePassword) {
            localStorage.setItem('lastPassword', password);
          } else {
            localStorage.removeItem('lastPassword');
          }
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }

}
