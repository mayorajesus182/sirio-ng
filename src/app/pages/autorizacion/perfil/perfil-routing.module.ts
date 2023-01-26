import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilFormComponent } from './form/perfil-form.component';

import { PerfilTableComponent } from './table/perfil-table.component';
import { PerfilViewComponent } from './view/perfil-view.component';


export const perfilRoutes: Routes = [
  {
    path: '',
    component: PerfilTableComponent
  },
  {
    path: 'add',
    component: PerfilFormComponent,
    data: { title: 'Crear Perfil' }
  },
  {
    path: ':id/edit',
    component: PerfilFormComponent,
    data: { title: 'Editar Perfil' }
  },
  {
    path: ':id/view',
    component: PerfilViewComponent,
    data: { title: 'Visualizar Perfil' }
  }

];

@NgModule({
  imports: [RouterModule.forChild(perfilRoutes)],
  exports: [RouterModule]
})
export class PerfilRoutingModule {
}

