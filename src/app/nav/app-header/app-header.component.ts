import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  template: `
    <div class="app-header">
        <div class="wrapper">
          <img src="img/logo.svg">
          <div class="app-header__user-info" *ngIf="user">
            <span (click)="logoutUser()"></span>
          </div>
        </div>
    </div>
  `,
  styleUrl: './app-header.component.scss'
})
export class NavHeaderComponent {

  @Input()
  user!: User | null | undefined;

  @Output()
  logout = new EventEmitter<any>();

  logoutUser(){
    this.logout.emit();
  }
}
