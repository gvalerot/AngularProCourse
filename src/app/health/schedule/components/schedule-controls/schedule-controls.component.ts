import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'schedule-controls',
  styleUrls: ['schedule-controls.component.scss'],
  imports:[DatePipe],
  template: ` 
    <div class="controls">
      <button type="button">
        <img src="img/chevron-left.svg" (click)="moveDate(offset-1)">
      </button>
      <p>{{selected | date: 'MMMM d, y'}}</p>
      <button type="button" (click)="moveDate(offset+1)">
        <img src="img/chevron-right.svg">
      </button>
    </div> 
  `,
})
export class ScheduleControlsComponent {

  offset = 0;

  @Input()
  selected!: Date;

  @Output()
  move = new EventEmitter<number>();

  moveDate(offset: number){
    this.offset = offset;
    this.move.emit(offset);
  }
}
