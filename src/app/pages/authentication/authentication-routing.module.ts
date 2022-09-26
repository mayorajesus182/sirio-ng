import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LockedComponent } from './locked/locked.component';
import { LoginComponent } from './login/login.component';


const authRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  
  {
    path: 'locked',
    component: LockedComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
