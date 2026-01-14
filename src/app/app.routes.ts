import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { DepartmentDashboardComponent } from './features/department/dashboard/dashboard.component';

// Placeholder components (We will build these next)
//import { DepartmentDashboardComponent } from './features/department/dashboard/dashboard.component';
// import { DitDashboardComponent } ... 

export const routes: Routes = [
  // 1. Default Route -> Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. The Login Page
  { path: 'login', component: LoginComponent },

  // 3. Protected Department Routes
  { 
    path: 'department', 
    children: [
      { path: 'dashboard', component: DepartmentDashboardComponent }
    ],
    canActivate: [authGuard] // <--- The Bouncer is here
  },

  // 4. Fallback (404)
  { path: '**', redirectTo: 'login' }
];