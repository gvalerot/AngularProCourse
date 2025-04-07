import { Injectable } from '@angular/core';
import { Workout } from '../interfaces/workout';
import { filter, from, map, Observable, of } from 'rxjs';
import { AuthService } from '../../../auth/services/auth-service';
import {
  Database,
  onValue,
  push,
  ref,
  remove,
  set,
} from '@angular/fire/database';
import { Store } from '../../../../store';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private baseRef = 'workouts';
  workouts$!: Observable<Workout[]>;

  constructor(
    private auth: AuthService,
    private db: Database,
    private store: Store
  ) {
    this.workouts$ = this.getWorkouts();
  }

  getWorkouts(): Observable<Workout[]> {
    const id = this.auth.user?.uid;
    if (!id) {
      return of([]);
    }

    const workoutsRef = ref(this.db, `${this.baseRef}/${id}`);
    return new Observable((observer) => {
      const unsubscribe = onValue(workoutsRef, (snapshot) => {
        const workouts: Workout[] = [];
        snapshot.forEach((childSnapshot) => {
          const workout: Workout = {
            ...childSnapshot.val(),
            key: childSnapshot.key,
          };
          workouts.push(workout);
        });
        this.store.set('workouts', workouts);
        observer.next(workouts);
      });

      return { unsubscribe };
    });
  }

  getWorkout(key: string): Observable<Workout | undefined> {
    if (!key) return of(undefined);

    return this.store.select<Workout[]>('workouts').pipe(
      filter(Boolean),
      map((workouts) =>
        workouts.find((workout: Workout) => workout.key === key)
      )
    );
  }

  addWorkout(workout: Workout) {
    const reference = ref(this.db, `workouts/${this.auth.user?.uid}`);

    return from(push(reference, workout));
  }

  removeWorkout(key: string) {
    const id = this.auth.user?.uid;
    const workoutRef = ref(this.db, `workouts/${id}/${key}`);
    return remove(workoutRef);
  }

  updateWorkout(key: string, workout: Workout) {
    const id = this.auth.user?.uid;
    const workoutRef = ref(this.db, `workouts/${id}/${key}`);

    return set(workoutRef, workout);
  }
}
