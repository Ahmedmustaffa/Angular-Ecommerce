import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  loginForm: FormGroup;
  errorMessage = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
      if (this.loginForm.valid) {
        this.authService.loginUser(this.loginForm.value).subscribe({
          next: (res) => {
            localStorage.setItem('token', res.token);
            localStorage.setItem('userRole', res.user.role); 
            this.router.navigate(['/products']);
          },
          error: (err) => {
            this.errorMessage.set(err.error?.message || 'Account not found or incorrect password.');
          }
        });
      }
    }
}