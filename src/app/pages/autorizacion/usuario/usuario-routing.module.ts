import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UsuarioDetailComponent } from './detail/usuario-detail.component';
// import { UsuarioFormComponent } from './form/usuario-form.component';
import { UsuarioTableComponent } from './table/usuario-table.component';


const usuarioRoutes: Routes = [
  {
    path: '',
    component: UsuarioTableComponent,
    data: { title: 'Usuarios' }
  },
  // {
  //   path: 'add',
  //   component: UsuarioFormComponent,
  //   data: { title: 'Crear Usuario' }
  // },
  // {
  //   path: ':id/edit',
  //   component: UsuarioFormComponent,
  //   data: { title: 'Editar Usuario' }
  // },
  {
    path: ':id/view',
    component: UsuarioDetailComponent,
    data: { title: 'Visualizar Usuario' }
  }
];



@NgModule({
  imports: [RouterModule.forChild(usuarioRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}

