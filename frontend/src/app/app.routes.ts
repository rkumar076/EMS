import { Routes } from '@angular/router';

export const routes: Routes = [


  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // 🔐 LOGIN
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  // 📝 SIGNUP
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/auth/signup/signup.component')
        .then(m => m.SignupComponent)
  },

  // 🏠 DASHBOARD
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  // 👨‍💼 EMPLOYEES
  {
    path: 'employees',
    loadComponent: () =>
      import('./features/employees/employee-list/employee-list.component')
        .then(m => m.EmployeeListComponent)
  },

  // ❌ invalid URL → redirect
  {
    path: '**',
    redirectTo: 'signup'
  }

];