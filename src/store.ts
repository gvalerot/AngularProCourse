import { User } from '@angular/fire/auth';

import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

import { Meal } from './app/health/meals/interfaces/Meal';
import { Workout } from './app/health/workouts/interfaces/workout';
import { ScheduleItem } from './app/health/schedule/interfaces/schedule';

export interface State {
  user: User | null | undefined;
  meals?: Meal[];
  workouts?: Workout[];
  date?: Date;
  schedule?: ScheduleItem[];
  list: any;
  selected: any;
  [key: string]: any;
}

const initialState: State = {
  user: undefined,
  meals: undefined,
  workouts: undefined,
  date: undefined,
  schedule: undefined,
  list: undefined,
  selected: undefined,
};

export class Store {
  private subject = new BehaviorSubject<State>(initialState);
  private store = this.subject.asObservable().pipe(distinctUntilChanged());

  get value() {
    return this.subject.value;
  }

  select<T>(name: keyof State): Observable<T> {
    return this.store.pipe(map((state) => state[name] as T));
  }

  set(name: string, state: any) {
    this.subject.next({
      ...this.value,
      [name]: state === null ? undefined : state,
    });
  }
}
