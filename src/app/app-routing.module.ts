import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/@sirio/guards/auth.guard';
import { BoxOfficeGuard } from 'src/@sirio/guards/boxoffice.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user/login',
    pathMatch: 'full'
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthModule),
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
        path: 'help',
        loadChildren: () => import('./pages/help-components/components.module').then(m => m.HelpComponentsModule),
      },
      {
        path: 'welcome',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
        
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        
      },
      // {
      //   path: 'personas',
      //   loadChildren: () => import('./pages/tables/all-in-one-table/all-in-one-table.module').then(m => m.AllInOneTableModule),
      //   data:{title:'menu.naturalPersons'}
      // },
      {
        path: 'persona',
        loadChildren: () => import('./pages/persona/persona.module').then(m => m.PersonaModule),
        data:{title:'menu.persons'}
      },
      {
        path: 'preferencia',
        loadChildren: () => import('./pages/preferencia/preferencia.module').then(m => m.PreferenciaModule),
        data:{title:'menu.preference'}
      },
      {
        path: 'organizacion',
        loadChildren: () => import('./pages/organizacion/organizacion.module').then(m => m.OrganizacionModule),
        data:{title:'menu.organization'}
      },
      {
        path: 'configuracion',
        loadChildren: () => import('./pages/configuracion/configuracion.module').then(m => m.ConfiguracionModule),
        data:{title:'menu.configuration'}
      },
      {
        path: 'transporte',
        loadChildren: () => import('./pages/transporte/transporte.module').then(m => m.TransporteModule),
        data:{title:'menu.transport'}
      },
      {
        path: 'taquilla',
        canActivate: [BoxOfficeGuard],
        loadChildren: () => import('./pages/taquilla/taquilla.module').then(m => m.TaquillaModule),
        data:{title:'menu.taquilla'}
      },
      {
        path: 'control-efectivo',
        loadChildren: () => import('./pages/control-efectivo/control-efectivo.module').then(m => m.ControlEfectivoModule),
        data:{title:'menu.cashControl'}
      },
      {
        path: 'workflow',
        loadChildren: () => import('./pages/workflow/workflow.module').then(m => m.WorkflowModule),
        data:{title:'menu.cashControl'}
      },
      {
        path: 'estadistica',
        loadChildren: () => import('./pages/estadistica/estadistica.module').then(m => m.EstadisticaModule),
        data:{title:'Estadisticas'}
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'errors/404'
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
