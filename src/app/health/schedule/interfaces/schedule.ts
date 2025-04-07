import { Meal } from "../../meals/interfaces/Meal";
import { Workout } from "../../workouts/interfaces/workout";

export interface ScheduleItem {
  meals?: Meal[];
  workouts?: Workout[];
  section: string;
  timestamp: number;
  key?: string;
}

export interface ScheduleList {
  morning?: ScheduleItem;
  lunch?: ScheduleItem;
  evening?: ScheduleItem;
  snacks?: ScheduleItem;
  [key: string]: any;
}