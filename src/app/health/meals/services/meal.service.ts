import { Injectable } from '@angular/core';
import { Store } from '../../../../store';
import {
  Database,
  onValue,
  push,
  ref,
  remove,
  set,
} from '@angular/fire/database';
import { AuthService } from '../../../auth/services/auth-service';
import { Meal } from '../interfaces/Meal';
import { filter, from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private baseRef = 'meals';
  meals$: Observable<Meal[]>;

  constructor(
    private store: Store,
    private db: Database,
    private authService: AuthService
  ) {
    this.meals$ = this.getMeals();
  }

  getMeals(): Observable<Meal[]> {
    const userId = this.authService.user?.uid;

    if (!userId) {
      return of([]);
    }

    const mealsRef = ref(this.db, `${this.baseRef}/${userId}`);
    return new Observable((observer) => {
      const unsubscribe = onValue(mealsRef, (snapshot) => {
        const meals: Meal[] = [];
        snapshot.forEach((childSnapshot) => {
          const meal: Meal = { ...childSnapshot.val(), key: childSnapshot.key };
          meals.push(meal);
        });
        this.store.set('meals', meals);
        observer.next(meals);
      });

      return { unsubscribe };
    });
  }

  getMeal(key: string): Observable<Meal | undefined> {
    if (!key) return of(undefined);

    return this.store.select<Meal[]>('meals').pipe(
      filter(Boolean),
      map((meals) => meals.find((meal: Meal) => meal.key === key))
    );
  }

  addMeal(meal: Meal) {
    const id = this.authService.user?.uid;
    const reference = ref(this.db, `${this.baseRef}/${id}`);

    return from(push(reference, meal));
  }

  updateMeal(key: string, meal: Meal) {
    const id = this.authService.user?.uid;
    const mealRef = ref(this.db, `${this.baseRef}/${id}/${key}`);

    return set(mealRef, meal);
  }

  async removeMeal(key: string) {
    const id = this.authService.user?.uid;
    const mealRef = ref(this.db, `${this.baseRef}/${id}/${key}`);

    await remove(mealRef);
    this.store
      .select<Meal[]>('meals')
      .pipe(
        filter(Boolean),
        map((meals) => meals.filter((m: Meal) => m.key !== key))
      )
      .subscribe((updatedMeals) => {
        this.store.set('meals', updatedMeals);
      });
  }
}
