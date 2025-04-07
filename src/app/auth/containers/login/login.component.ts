import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'login',
  imports: [AuthFormComponent, NgIf, RouterLink],
  styleUrl: './login.component.scss',
  template: `
    <div>
      <auth-form (submitted)="loginUser($event)">
        <h1>Login</h1>
        <a routerLink="/auth/register">Not registered?</a>
        <button type="submit">Login</button>
        <div class="error" *ngIf="error">
          {{ error }}
        </div>
      </auth-form>
    </div>
  `,
})
export class LoginComponent {
  error!: string;

  constructor(private authService: AuthService, private router: Router) {}

  async loginUser(event: FormGroup) {
    const { email, password } = event.value;
    try {
      await this.authService.login(email, password).then((_) => {
        this.router.navigate(['/']);
      });
    } catch (err: any) {
      this.error = err.message;
    }
  }
}
