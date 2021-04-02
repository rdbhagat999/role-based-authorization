import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from '@helpers/index';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { Role } from './models';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  { path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN] }
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
