import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordMatched } from '../../CrossFieldValidation/passwordMatched';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './sign-up.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUp {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('[A-Za-z]{3,}')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmedPassword: ['', [Validators.required]]
    }, { validators: [passwordMatched()] });
  }

  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmedPassword() { return this.registerForm.get('confirmedPassword'); }

  onSubmit() {
    if (this.registerForm.valid) {
      const { confirmedPassword, ...userData } = this.registerForm.value;
      
      this.authService.registerUser(userData).subscribe({
        next: (res) => {
          alert('Account created successfully!');
          this.router.navigate(['/login']);
        },
        error: (err) => alert(err.error?.message || 'Error during registration')
      });
    }
  }
}