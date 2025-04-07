import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'auth-form',
  imports: [NgIf, ReactiveFormsModule],
  template: `
    <div class="auth-form">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <ng-content select="h1"></ng-content>
        <label>
          <input
            type="email"
            placeholder="Email address"
            formControlName="email"
          />
        </label>
        <label>
          <input
            type="password"
            placeholder="Enter password"
            formControlName="password"
          />
        </label>

        <div class="error" *ngIf="emailFormat">Invalid email format</div>

        <div class="error" *ngIf="passwordInvalid">Password is required</div>

        <ng-content select=".error"></ng-content>

        <div class="auth-form__action">
          <ng-content select="button"></ng-content>
        </div>

        <div class="auth-form__toggle">
          <ng-content select="a"></ng-content>
        </div>
      </form>
    </div>
  `,
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
  form: FormGroup;

  @Output()
  submitted = new EventEmitter<FormGroup>();
  
  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted.emit(this.form);
  }

  get passwordInvalid() {
    const control = this.form.get('password');
    return control?.hasError('required') && control.touched;
  }

  get emailFormat() {
    const control = this.form.get('email');
    return control?.hasError('email') && control.touched;
  }
}
