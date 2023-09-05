import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import the components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { GroupAdminDashboardComponent } from './components/group-admin-dashboard/group-admin-dashboard.component';
import { SuperAdminDashboardComponent } from './components/super-admin-dashboard/super-admin-dashboard.component';

// Import the AuthGuard
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default route redirects to login
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'chat/:groupId/:channelId', component: ChatComponent },
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard], data: { roles: ['User'] } },
  { path: 'group-admin-dashboard', component: GroupAdminDashboardComponent, canActivate: [AuthGuard], data: { roles: ['GroupAdmin'] } },
  { path: 'super-admin-dashboard', component: SuperAdminDashboardComponent, canActivate: [AuthGuard], data: { roles: ['SuperAdmin'] } },
  // ... other routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
