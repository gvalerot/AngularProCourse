import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { ScheduleItem, ScheduleList } from '../interfaces/schedule';
import { AuthService } from '../../../auth/services/auth-service';
import { Store } from '../../../../store';
import {
  Database,
  endAt,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  set,
  startAt,
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private date$ = new BehaviorSubject(new Date());
  private section$ = new Subject();
  private itemList$ = new Subject();

  schedule$!: Observable<ScheduleItem[]>;
  selected$!: any;
  list$!: any;
  items$!: Observable<any>;

  constructor(
    private authService: AuthService,
    private store: Store,
    private db: Database
  ) {
    this.items$ = this.itemList$.pipe(
      withLatestFrom(this.section$),
      map(([items, section]: any[]) => {
        const id = section.data.id;

        const defaults: ScheduleItem = {
          workouts: undefined,
          meals: undefined,
          section: section.section,
          timestamp: new Date(section.day).getTime(),
        };

        const payload = {
          ...(id ? section.data : defaults),
          ...items,
        };

        if (id) {
          return this.updateSection(id, payload);
        } else {
          return this.createSection(payload);
        }
      })
    );

    this.schedule$ = this.date$.pipe(
      tap((next: any) => {
        this.store.set('date', next);
      }),
      map((day: any) => {
        const startAt = new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate()
        ).getTime();
        const endAt =
          new Date(
            day.getFullYear(),
            day.getMonth(),
            day.getDate() + 1
          ).getTime() - 1;

        return { startAt, endAt };
      }),
      switchMap(({ startAt, endAt }: any) => this.getSchedule(startAt, endAt)),
      map((data: any) => {
        const mapped: ScheduleList = {};
        console.log(data);
        for (const prop of Object.values(data) as ScheduleItem[]) {
          if (!mapped[prop.section]) {
            mapped[prop.section] = prop;
          }
        }

        return mapped;
      }),
      tap((next: any) => this.store.set('schedule', next))
    );

    this.selected$ = this.section$.pipe(
    
      tap((next) => {this.store.set('selected', next)
        console.log('selected', next)
      } )
    );

    this.list$ = this.section$.pipe(
      map((value: any) => {
        return this.store.value[value.type];
      }),
      tap((next: any) => this.store.set('list', next))
    );
  }

  private getSchedule(start: number, end: number) {
    const id = this.authService.user?.uid;

    if (!id) {
      return of([]);
    }
    const reference = ref(this.db, `schedule/${id}`);
    const queryRefence = query(
      reference,
      orderByChild('timestamp'),
      startAt(start),
      endAt(end)
    );

    return new Observable((observer) => {
      onValue(queryRefence, (snapshot) => {
        const data = snapshot.val();
        const schedule: ScheduleItem[] = data
          ? Object.values(
              Object.entries(data).map(([key, value]) => ({
                ...(value as ScheduleItem),
                id: key, // Agrega el campo `id` dentro del objeto
              }))
            )
          : [];

        observer.next(Object.values(schedule));
        //this.store.set('schedule', schedule); // Actualiza el Store en tiempo real
      });
    });
  }

  private updateSection(key: string, payload: ScheduleItem) {
    const id = this.authService.user?.uid;
    console.log(payload);
    const reference = ref(this.db, `schedule/${id}/${key}`);
    const cleanedPayload = this.cleanPayload(payload);
    return set(reference, cleanedPayload);
  }

  private createSection(payload: ScheduleItem) {
    const id = this.authService.user?.uid;
    const reference = ref(this.db, `schedule/${id}`);
    const cleanedPayload = this.cleanPayload(payload);
    return push(reference, cleanedPayload);
  }

  private cleanPayload(payload: any): any {
    return Object.fromEntries(
      Object.entries(payload).filter(
        ([key, value]) => key !== '$key' && value !== undefined
      )
    );
  }

  selectSection(event: any) {
    this.section$.next(event);
  }

  updateItems(items: string[]) {
    this.itemList$.next(items);
  }

  updateDate(date: Date) {
    this.date$.next(date);
  }
}
