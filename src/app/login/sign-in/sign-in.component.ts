import {Component, OnInit, Optional} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';
import {AuthService, LoginRequest, LoginResponse} from '../../services/auth.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ReactiveFormsModule} from '@angular/forms';
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
  returnUrl: string = '/'; // default route if none is provided
  infoMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    @Optional() private dialogRef: MatDialogRef<SignInComponent>,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    const lastEmail = localStorage.getItem('lastEmail') || '';
    const lastPassword = localStorage.getItem('lastPassword') || '';
    const savePassword = !!lastPassword;

    this.signInForm = this.fb.group({
      email: [lastEmail, [Validators.required, Validators.email]],
      password: [savePassword ? lastPassword : '', Validators.required],
      savePassword: [savePassword]
    });

    // Read query parameters for returnUrl and info message
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
          // Save token, email, and password as needed
          localStorage.setItem('token', response.token);
          localStorage.setItem('lastEmail', email);
          if (savePassword) {
            localStorage.setItem('lastPassword', password);
          } else {
            localStorage.removeItem('lastPassword');
          }
          // If this component is used as a dialog, close it;
          // otherwise, navigate to the returnUrl.
          if (this.dialogRef) {
            this.dialogRef.close(response);
          } else {
            this.router.navigateByUrl(this.returnUrl);
          }
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }

}
