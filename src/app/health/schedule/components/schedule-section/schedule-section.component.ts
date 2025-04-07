import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ScheduleItem } from '../../interfaces/schedule';
import { NgIf } from '@angular/common';
import { JoinPipe } from '../../../pipes/join.pipe';

@Component({
  selector: 'schedule-section',
  styleUrls: ['schedule-section.component.scss'],
  imports: [NgIf, JoinPipe],
  template: `
    <div class="schedule-section">
      <div class="schedule-section__bar">
        {{ name }}
      </div>

      <div>
        <div
          class="schedule-section__item food"
          *ngIf="section.meals; else addMeal"
          (click)="onSelect('meals', section.meals)"
        >
          <span>{{ section.meals | join }}</span>
        </div>
        <ng-template #addMeal>
          <div class="schedule-section__item" (click)="onSelect('meals')">
            Assign meal
          </div>
        </ng-template>
        <div
          class="schedule-section__item workout"
          *ngIf="section.workouts; else addWorkout"
          (click)="onSelect('workouts', section.workouts)"
        >
          <span>{{ section.workouts | join }}</span>
        </div>
        <ng-template #addWorkout>
          <div class="schedule-section__item" (click)="onSelect('workouts')">
            Assign workout
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class ScheduleSectionComponent {
  @Input()
  name!: string;

  @Input()
  section!: ScheduleItem;

  @Output()
  select = new EventEmitter<any>();

  onSelect(type: string, assigned: any[] = []){
    const data = this.section;
    this.select.emit({
      type,
      assigned,
      data
    })
  }
}
