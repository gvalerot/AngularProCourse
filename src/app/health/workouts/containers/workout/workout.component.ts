import { Component, OnDestroy, OnInit } from '@angular/core';
import { Workout } from '../../interfaces/workout';
import { map, Observable, Subscription, switchMap } from 'rxjs';
import { WorkoutService } from '../../services/workout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { WorkoutFormComponent } from "../../components/workout-form/workout-form.component";

@Component({
  selector: 'workout',
  imports: [NgIf, AsyncPipe, WorkoutFormComponent],
  template: `
    <div class="workout">
      <div class="workout__title">
        <h1>
          <img src="img/workout.svg" />
          <span *ngIf="workout$; else title">
            {{ (workout$ | async)?.name ? 'Edit' : 'Create' }} workout</span
          >
          <ng-template #title> Loading... </ng-template>
        </h1>
      </div>
      <div *ngIf="workout$ | async as workout; else loading">
        <workout-form
          [workout]="workout"
          (create)="addWorkout($event)"
          (update)="updateWorkout($event)"
          (remove)="removeWorkout()"
        ></workout-form>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="img/loading.svg" />
          Fetching workout...
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './workout.component.scss'
})
export class WorkoutComponent implements OnInit, OnDestroy{
  workout$!: Observable<Workout>;
  subscription!: Subscription;

  constructor(
    private workoutsService: WorkoutService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.workoutsService.getWorkouts().subscribe();
    this.workout$ = this.route.params.pipe(
      switchMap((params) => this.workoutsService.getWorkout(params['id'])),
      map((workout) => {
        console.log(workout);
        return (
          workout || {
            name: '',
            strength: '',
            type: '',
            endurance: '',
            timestamp: 0,
            key: '',
          }
        );
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addWorkout(event: Workout) {
    try {
      this.workoutsService.addWorkout(event);
      this.backToWorkouts();
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  }

  async updateWorkout(event: Workout) {
    const key = this.route.snapshot.params['id'];
    await this.workoutsService.updateWorkout(key, event);
    this.backToWorkouts();
  }

  removeWorkout() {
    const key = this.route.snapshot.params['id'];
    this.workoutsService.removeWorkout(key);
    this.backToWorkouts();
  }

  backToWorkouts() {
    this.router.navigate(['workouts']);
  }
}
