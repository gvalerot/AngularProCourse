import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AppNavComponent } from "./nav/app-nav/app-nav.component";
import { NavHeaderComponent } from "./nav/app-header/app-header.component";
import { Store } from '../store';

import { User } from '@angular/fire/auth';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthService } from './auth/services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppNavComponent, NavHeaderComponent, AsyncPipe],
  template: `
    <div>
      <app-header [user]="user$ | async" (logout)="logout()"></app-header>
      <app-nav></app-nav>
      <div class="wrapper">
        <router-outlet></router-outlet>
      </div> 
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  
  user$!: Observable<User | null | undefined>;
  subscription!: Subscription;
  constructor(private store: Store, private authService: AuthService, private router: Router){}
  
  ngOnInit(): void {
    this.user$ = this.authService.user$;
    this.subscription = this.authService.user$.subscribe();

  }
  ngOnDestroy(): void {
    
  }

  async logout(){
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}
