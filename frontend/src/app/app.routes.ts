import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'employees',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component')
        .then(m => m.SignupComponent)
  },

  // 🔒 PROTECTED
  {
    path: 'dashboard',
    canActivate: [AuthGuard],   // ✅ yaha add karo
    loadComponent: () =>
      import('./features/dashboard/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  // 🔒 PROTECTED
  {
    path: 'employees',
    canActivate: [AuthGuard],   // ✅ yaha add karo
    loadComponent: () =>
      import('./features/employees/employee-list/employee-list.component')
        .then(m => m.EmployeeListComponent)
  },

  {
    path: '**',
    redirectTo: 'login'   // 👈 better than signup
  }

];