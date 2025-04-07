import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { Meal } from '../../interfaces/Meal';
import { MealService } from '../../services/meal.service';
import { Store } from '../../../../../store';
import { ListItemComponent } from '../../../components/list-item/list-item.component';

@Component({
  selector: 'meals',
  imports: [RouterLink, NgIf, NgForOf, AsyncPipe, ListItemComponent],
  template: `
    <div class="meals">
      <div class="meals__title">
        <h1>
          <img src="/img/food.svg" />
          Your meals
        </h1>
        <a class="btn__add" [routerLink]="['../meals/new']">
          <img src="/img/add-white.svg" />
          New meal
        </a>
      </div>
      <div *ngIf="meals$ | async as meals; else loading">
        <div class="message" *ngIf="!meals.length">
          <img src="/img/face.svg" />
          No meals, add a new meal to start
        </div>
        <list-item
          *ngFor="let meal of meals"
          [item]="meal"
          (remove)="removeMeal($event)"
        >
        </list-item>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="/img/loading.svg" />
          Fetching meals...
        </div>
      </ng-template>
    </div>
  `,
  styleUrl: './meals.component.scss',
})
export class MealsComponent implements OnInit, OnDestroy {
  meals$!: Observable<Meal[] | undefined>;
  subscription!: Subscription;

  constructor(private mealsService: MealService, private store: Store) {}

  ngOnInit(): void {
    this.meals$ = this.store.select<Meal[]>('meals');
    this.subscription = this.mealsService.meals$.subscribe();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeMeal(meal: Meal) {
    this.mealsService.removeMeal(meal.key).then(() => {
      console.log('Meal removed successfully!');
    });
  }
}
