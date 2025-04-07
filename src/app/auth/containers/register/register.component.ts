import { Component } from '@angular/core';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'register',
  imports: [AuthFormComponent, NgIf],
  template: `
    <div>
      <auth-form (submitted)="registerUser($event)">
        <h1>Register</h1>
        <a routerLink="/auth/login">Already have an account?</a>
        <button type="submit">Create an account</button>
        <div class="error" *ngIf="error">
          {{ error }}
        </div>
      </auth-form>
    </div>
  `,
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  error!: string;

  constructor(private authService: AuthService, private router: Router) {}

  async registerUser(event: FormGroup) {
    const { email, password } = event.value;
    console.log("Clicked?")
    try {
      await this.authService.createUser(email, password);
      this.router.navigate(['/'])
    } catch (err: any) {
      this.error = err.message;
    }
  }
}
