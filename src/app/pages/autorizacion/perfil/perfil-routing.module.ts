import { Routes } from '@angular/router';
import { PerfilFormComponent } from './form/perfil-form.component';

import { PerfilTableComponent } from './table/perfil-table.component';
import { PerfilViewComponent } from './view/perfil-view.component';


export const PerfilRoutes: Routes = [
  {
    path: '',
    component: PerfilTableComponent,
    data: { title: 'Perfiles' }
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

