import { AuthGuard } from './auth/guard/auth-guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'schedule',
  },

  //AUTH ROUTES
  {
    path: 'auth',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/containers/login/login.component').then(
            (c) => c.LoginComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./auth/containers/register/register.component').then(
            (c) => c.RegisterComponent
          ),
      },
    ],
  },

  //MEALS ROUTES
  {
    path: 'meals',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./health/meals/containers/meals/meals.component').then(
        (c) => c.MealsComponent
      ),
  },

  {
    path: 'meals/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./health/meals/containers/meal/meal.component').then(
        (c) => c.MealComponent
      ),
  },

  {
    path: 'new',
    loadComponent: () =>
      import('./health/meals/containers/meal/meal.component').then(
        (c) => c.MealComponent
      ),
  },

  //SCHEDULE ROUTES
  {
    path: 'schedule',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./health/schedule/containers/schedule/schedule.component').then(
        (c) => c.ScheduleComponent
      ),
  },

  //WORKOUTS ROUTES
  {
    path: 'workouts',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./health/workouts/containers/workouts/workouts.component').then(
        (c) => c.WorkoutsComponent
      ),
  },
  
  {
    path: 'workouts/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./health/workouts/containers/workout/workout.component').then(
        (c) => c.WorkoutComponent
      ),
  },
  {
    path: 'workouts/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./health/workouts/containers/workout/workout.component').then(
        (c) => c.WorkoutComponent
      ),
  },
];
