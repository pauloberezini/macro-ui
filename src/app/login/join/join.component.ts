import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RegistrationDTO, RegistrationService } from "../../services/registration.service";
import {MatCardModule} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule
  ],
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  joinForm: FormGroup;
  message: string = ''; // Success/Error message
  isSuccess: boolean = false; // Track if success or error
  isRegistered: boolean = false; // Hide form when successful

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<JoinComponent>,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.joinForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.joinForm.valid) {
      const formData: RegistrationDTO = this.joinForm.value;
      this.registrationService.registerUser(formData).subscribe({
        next: (response: string) => {
          this.message = response; // Set success message
          this.isSuccess = true; // Mark as success
          this.isRegistered = true; // Hide the form
        },
        error: () => {
          this.message = 'Registration failed. Please try again.'; // Set error message
          this.isSuccess = false; // Mark as error
        }
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close the modal/dialog
  }
}
