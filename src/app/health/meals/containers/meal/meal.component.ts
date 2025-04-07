import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Observable, Subscription, switchMap } from 'rxjs';
import { Meal } from '../../interfaces/Meal';
import { MealFormComponent } from '../../components/meal-form/meal-form.component';
import { MealService } from '../../services/meal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'meal',
  imports: [MealFormComponent, AsyncPipe, NgIf],
  template: `
    <div class="meal">
      <div class="meal__title">
        <h1>
          <img src="img/food.svg" />
          <span *ngIf="meal$ | async as meal; else title">
            {{ meal?.name ? 'Edit' : 'Create' }} meal</span
          >
          <ng-template #title> Loading... </ng-template>
        </h1>
      </div>
      <div *ngIf="meal$ | async as meal; else loading">
        <meal-form
          [meal]="meal"
          (create)="addMeal($event)"
          (update)="updateMeal($event)"
          (remove)="removeMeal($event)"
        >
        </meal-form>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="img/loading.svg" />
          Fetching meal...
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './meal.component.scss',
})
export class MealComponent implements OnInit, OnDestroy {
  meal$!: Observable<Meal>;
  subscription!: Subscription;

  constructor(
    private mealsService: MealService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.mealsService.meals$.subscribe();
    this.meal$ = this.route.params.pipe(
      switchMap((params) => this.mealsService.getMeal(params['id'])),
      map((meal) => {
        return (
          meal || {
            name: '',
            ingredients: [],
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

  addMeal(event: Meal) {
    try {
      this.mealsService.addMeal(event);
      this.backToMeals();
    } catch (err: any) {
      console.error('Error adding meal: ', err.message);
    }
  }

  async updateMeal(event: Meal) {
    const key = this.route.snapshot.params['id'];
    await this.mealsService.updateMeal(key, event);
    this.backToMeals();
  }

  removeMeal(event: Meal) {}

  backToMeals() {
    this.router.navigate(['meals']);
  }
}
