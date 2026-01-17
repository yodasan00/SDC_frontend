import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { CreateTicketComponent } from './features/department/create-ticket/create-ticket.component';
import { DepartmentLayoutComponent } from './features/department/department-layout/department-layout.component';
import { TicketListComponent } from './features/department/ticket-list/ticket-list.component';
import { DepartmentHomeComponent } from './features/department/home/home.component';
import { DitPendingComponent } from './features/dit/dit-pending/dit-pending.component';
import { DitHomeComponent } from './features/dit/dit-home/dit-home.component';
import { DitLayoutComponent } from './features/dit/dit-layout/dit-layout.component';

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
    component: DepartmentLayoutComponent, // <--- The Parent (Sidebar lives here)
    children: [
      { path: 'home', component: DepartmentHomeComponent },          // <--- Landing Page
      { path: 'my-tickets', component: TicketListComponent },        // <--- Status List
      { path: 'create-ticket', component: CreateTicketComponent },   // <--- New Ticket
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
    , canActivate: [authGuard]
  },
  { 
    path: 'dit', 
    component: DitLayoutComponent,
    children: [
      { path: 'home', component: DitHomeComponent },
      { path: 'pending', component: DitPendingComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
    , canActivate: [authGuard]
  },

  // 4. Fallback (404)
  { path: '**', redirectTo: 'login' }
];