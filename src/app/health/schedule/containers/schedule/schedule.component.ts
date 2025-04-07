import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Meal } from '../../../meals/interfaces/Meal';
import { Workout } from '../../../workouts/interfaces/workout';
import { ScheduleItem } from '../../interfaces/schedule';
import { Store } from '../../../../../store';
import { ScheduleService } from '../../services/schedule.service';
import { MealService } from '../../../meals/services/meal.service';
import { WorkoutService } from '../../../workouts/services/workout.service';

import { ScheduleCalendarComponent } from '../../components/schedule-calendar/schedule-calendar.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { ScheduleAssignComponent } from '../../components/schedule-assign/schedule-assign.component';

@Component({
  selector: 'schedule',
  imports: [NgIf, AsyncPipe, ScheduleCalendarComponent, ScheduleAssignComponent],
  template: `
    <div class="schedule">
      <schedule-calendar
        [date]="(date$ | async) ?? date"
        [items]="(schedule$ | async) ?? []"
        (change)="changeDate($event)"
        (select)="changeSection($event)"
      >
      </schedule-calendar>

      <schedule-assign
        *ngIf="open"
        [section]="selected$ | async"
        [list]="(list$ | async) ?? []"
        (update)="assignItem($event)"
        (cancel)="closeAssign()"      
      >
      </schedule-assign>
    </div>
  `,
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  date: Date = new Date();

  open = false;

  date$!: Observable<Date>;
  selected$!: Observable<any>;
  list$!: Observable<Meal[] | Workout[]>;
  schedule$!: Observable<ScheduleItem[]>;
  subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private scheduleService: ScheduleService,
    private mealsService: MealService,
    private workoutsService: WorkoutService
  ) {}
  

  ngOnInit(): void {
    this.date$ = this.store.select('date');
    this.schedule$ = this.store.select<ScheduleItem[]>('schedule');
    this.selected$ = this.store.select('selected');
    this.list$ = this.store.select('list');

    this.subscriptions = [
      this.scheduleService.schedule$.subscribe(),
      this.scheduleService.selected$.subscribe(),
      this.scheduleService.list$.subscribe(),
      this.scheduleService.items$.subscribe(),
      this.mealsService.meals$.subscribe(),
      this.workoutsService.workouts$.subscribe(),
    ];

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  changeDate(date: Date) {
    this.scheduleService.updateDate(date);
  }

  changeSection(event: any) {
    (this.open = true), this.scheduleService.selectSection(event);
  }

  closeAssign(){
    this.open = false;
  }

  assignItem(items: string[]){
    this.scheduleService.updateItems(items);
    this.closeAssign();
  }
}
