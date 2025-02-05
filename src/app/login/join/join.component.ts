import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogRef} from '@angular/material/dialog';
import {RegistrationDTO, RegistrationService} from "../../services/registration.service";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
})
export class JoinComponent implements OnInit {
  joinForm: FormGroup;


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JoinComponent>,
    private registrationService: RegistrationService  // inject the service here
  ) {
  }

  ngOnInit(): void {
    this.joinForm = this.fb.group({
      name: ['', Validators.required],        // Name / Nickname is required
      surname: [''],                            // Surname is optional
      email: ['', [Validators.required, Validators.email]], // Email is required and must be valid
      password: ['', Validators.required]       // Password is required
    });
  }

  onSubmit(): void {
    if (this.joinForm.valid) {
      const formData: RegistrationDTO = this.joinForm.value;
      console.log('Join form data:', formData);

      // Call the registration API
      this.registrationService.registerUser(formData).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Optionally, close the dialog and pass data or show a success message
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Registration error', error);
          // Optionally, show an error message to the user
        }
      });
    }
  }
}
