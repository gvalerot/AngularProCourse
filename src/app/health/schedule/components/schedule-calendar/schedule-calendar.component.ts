import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ScheduleItem, ScheduleList } from '../../interfaces/schedule';

import { ScheduleControlsComponent } from '../schedule-controls/schedule-controls.component';
import { ScheduleDaysComponent } from '../schedule-days/schedule-days.component';
import { ScheduleSectionComponent } from '../schedule-section/schedule-section.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'schedule-calendar',
  styleUrls: ['schedule-calendar.component.scss'],
  imports: [
    NgFor,
    ScheduleControlsComponent,
    ScheduleDaysComponent,
    ScheduleSectionComponent,
  ],
  template: `
    <div class="calendar">
      <schedule-controls [selected]="selectedDay" (move)="onChange($event)">
      </schedule-controls>

      <schedule-days [selected]="selectedDayIndex" (select)="selectDay($event)">
      </schedule-days>

      <schedule-section
        *ngFor="let section of sections; index as i"
        [name]="section.name"
        [section]="getSection(section.key)"
        (select)="selectSection($event, section.key)"
      >
      </schedule-section>
    </div>
  `,
})
export class ScheduleCalendarComponent implements OnChanges {
  selectedDayIndex!: number;
  selectedDay!: Date;
  selectedWeek!: Date;

  sections = [
    { key: 'morning', name: 'Morning' },
    { key: 'lunch', name: 'Lunch' },
    { key: 'evening', name: 'Evening' },
    { key: 'snacks', name: 'Snacks and Drinks' },
  ];

  @Input()
  items!: ScheduleList;

  @Input()
  set date(date: Date) {
    this.selectedDay = new Date(date.getTime());
  }

  @Output()
  change = new EventEmitter<Date>();

  @Output()
  select = new EventEmitter<any>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.selectedDayIndex = this.getToday(this.selectedDay);
    this.selectedWeek = this.getStartOfWeek(new Date(this.selectedDay));
  }

  getSection(name: string): ScheduleItem {
    return (this.items && this.items[name]) || {};
  }

  onChange(weekOffset: number) {
    const startOfWeek = this.getStartOfWeek(new Date());
    const startDate = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate()
    );
    startDate.setDate(startDate.getDate() + weekOffset * 7);
    this.change.emit(startDate);
  }

  selectDay(index: number) {
    const selectedDay = new Date(this.selectedWeek);
    selectedDay.setDate(selectedDay.getDate() + index);
    this.change.emit(selectedDay);
  }

  private getStartOfWeek(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  private getToday(date: Date) {
    let today = date.getDay() - 1;
    if (today < 0) {
      today = 6;
    }

    return today;
  }

  selectSection({ type, assigned, data }: any, section: string) {
    const day = this.selectedDay;
    this.select.emit({
      type,
      assigned,
      section,
      day,
      data,
    });
  }
}
