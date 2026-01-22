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
import { SdcPendingComponent } from './features/sdc/sdc-pending/sdc-pending.component';
import { SdcHomeComponent } from './features/sdc/sdc-home/sdc-home.component';
import { SdcLayoutComponent } from './features/sdc/sdc-layout/sdc-layout.component';
import { SdcActiveComponent } from './features/sdc/sdc-active/sdc-active.component';
import { TicketDetailsComponent } from './features/shared/ticket-details/ticket-details.component';
import { DitHistoryComponent } from './features/dit/dit-history/dit-history.component';
import { SdcHistoryComponent } from './features/sdc/sdc-history/sdc-history.component';
import { DitApprovalComponent } from './features/dit/dit-approval/dit-approval.component';
import { SdcWorkspaceComponent } from './features/sdc/sdc-workspace/sdc-workspace.component';
import path from 'node:path';
import { OfficerLayoutComponent } from './features/officer/officer-layout/officer-layout.component';
import { OfficerDashboardComponent } from './features/officer/officer-dashboard/officer-dashboard.component';
import { OfficerSearchComponent } from './features/officer/officer-search/officer-search.component';
import { RegisterComponent } from './auth/register/register.component';


export const routes: Routes = [
  // 1. Default Route -> Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. The Login Page
  { path: 'login', component: LoginComponent },


  { path: 'register', component: RegisterComponent },

  // 3. Protected Department Routes
  { 
    path: 'department', 
    component: DepartmentLayoutComponent,
    children: [
      { path: 'home', component: DepartmentHomeComponent },         
      { path: 'my-tickets', component: TicketListComponent },        
      { path: 'create-ticket', component: CreateTicketComponent },  
      { path: 'ticket/:id', component: TicketDetailsComponent },
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
      { path: 'ticket/:id', component: TicketDetailsComponent },
      { path: 'approve/:id', component: DitApprovalComponent },
      { path: 'history', component: DitHistoryComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
    , canActivate: [authGuard]
  },

  { 
    path: 'sdc', 
    component: SdcLayoutComponent,
    children: [
      { path: 'home', component: SdcHomeComponent },
      { path: 'pending', component: SdcPendingComponent }, 
      { path: 'active', component: SdcActiveComponent },
      { path: 'ticket/:id', component: TicketDetailsComponent },
      { path: 'work/:id', component: SdcWorkspaceComponent },
      { path: 'history', component: SdcHistoryComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
    , canActivate: [authGuard]
  },

  {
    path: 'officer',
    component: OfficerLayoutComponent, // The Shell/Sidebar
    canActivate: [authGuard],
    data: { role: 'OFFICER' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: OfficerDashboardComponent }, // Stats
      { path: 'search', component: OfficerSearchComponent },       // Registry
      { path: 'ticket/:id', component: TicketDetailsComponent }    // Read-only Details
    ]
  },
 
  // 4. Fallback (404)
  { path: '**', redirectTo: 'login' }
];