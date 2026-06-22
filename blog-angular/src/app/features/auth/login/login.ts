import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // true = tela de cadastro, false = tela de login
  isSignUpMode = signal(false);

  email = '';
  password = '';
  loading = signal(false);
  errorMessage = signal('');

  toggleMode() {
    this.isSignUpMode.set(!this.isSignUpMode());
    this.errorMessage.set('');
  }

  async submit() {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      if (this.isSignUpMode()) {
        await this.authService.signUp(this.email, this.password);
      } else {
        await this.authService.signIn(this.email, this.password);
      }
      this.router.navigate(['/posts']);
    } catch (err) {
      this.errorMessage.set((err as Error).message);
    } finally {
      this.loading.set(false);
    }
  }
}