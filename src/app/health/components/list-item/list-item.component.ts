import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { WorkoutPipe } from '../../pipes/workout.pipe';
import { JoinPipe } from '../../pipes/join.pipe';

@Component({
  selector: 'list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, RouterLink, WorkoutPipe, JoinPipe],
  template: `
    <div class="list-item">
      <a [routerLink]="getRoute(item)">
        <p class="list-item__name">{{ item.name }}</p>
        <p class="list-item__ingredients">
          <span *ngIf="item.ingredients; else showWorkout"
            >{{ item.ingredients | join }}
          </span>
        </p>
        <ng-template #showWorkout>
          <span>{{ item | workout }}</span>
        </ng-template>
      </a>

      <div class="list-item__delete" *ngIf="toggled">
        <p>Delete item?</p>
        <button type="button" class="confirm" (click)="removeItem()">
          Yes
        </button>
        <button type="button" class="cancel" (click)="toggle()">No</button>
      </div>

      <button class="trash" type="button" (click)="toggle()">
        <img src="/img/remove.svg" alt="trash" />
      </button>
    </div>
  `,
  styleUrl: './list-item.component.scss',
})
export class ListItemComponent {
  @Input() item: any; // not defined because it will be for different clases

  @Output()
  remove = new EventEmitter<any>();

  toggled = false;

  constructor() {}

  getRoute(item: any) {
    return [
      `/${item.ingredients ? 'meals' : 'workouts'}`, 
      item.key
    ];
  }

  toggle() {
    this.toggled = !this.toggled;
  }

  removeItem() {
    this.remove.emit(this.item);
    this.toggled = false;
  }
}
