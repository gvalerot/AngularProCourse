import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Workout } from '../../interfaces/workout';
import { WorkoutService } from '../../services/workout.service';
import { Store } from '../../../../../store';
import { ListItemComponent } from "../../../components/list-item/list-item.component";
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'workouts',
  imports: [NgIf, NgFor, RouterLink, AsyncPipe, ListItemComponent],
  template: `
    <div class="workouts">
      <div class="workouts__title">
        <h1>
          <img src="/img/workout.svg" />
          Your workouts
        </h1>
        <a class="btn__add" [routerLink]="['../workouts/new']">
          <img src="/img/add-white.svg" />
          New workout
        </a>
      </div>
      <div *ngIf="workouts$ | async as workouts; else loading">
        <div class="message" *ngIf="!workouts.length">
          <img src="/img/face.svg" />
          No workouts, add a new workout to start
        </div>
        <list-item
          *ngFor="let workout of workouts"
          [item]="workout"
          (remove)="removeWorkout($event)"
        >
          
        </list-item>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="/img/loading.svg" />
          Fetching workouts...
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './workouts.component.scss'
})
export class WorkoutsComponent implements OnInit, OnDestroy{
  workouts$!: Observable<Workout[] | undefined>;
  subscription!: Subscription;
  constructor(private workoutService: WorkoutService, private store: Store) {}
  ngOnInit(): void {
    this.workouts$ = this.store.select<Workout[]>('workouts');
    this.subscription = this.workoutService.getWorkouts().subscribe();
  }

  ngOnDestroy(): void {}

  removeWorkout(event: Workout){
    this.workoutService.removeWorkout(event.key).then(() => {
      
    }).catch((error)=> console.log(error))
  }
}
