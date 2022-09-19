import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@sirio/guards/auth.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user/login',
    pathMatch: 'full'
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/authentication/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'errors',
    loadChildren: () => import('./pages/errors/errors.module').then(m => m.ErrorsModule),
  },
  {
    path: 'sirio',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'welcome',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
        
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        
      },
      {
        path: 'personas',
        loadChildren: () => import('./pages/tables/all-in-one-table/all-in-one-table.module').then(m => m.AllInOneTableModule),
        data:{title:'menu.naturalPersons'}
      },
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
