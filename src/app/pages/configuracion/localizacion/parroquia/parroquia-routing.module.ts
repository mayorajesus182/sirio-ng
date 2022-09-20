import { Routes } from '@angular/router';
import { ParroquiaDetailComponent } from './detail/parroquia-detail.component';
import { ParroquiaFormComponent } from './form/parroquia-form.component';
import { ParroquiaComponent } from './parroquia.component';
import { ParroquiaTableComponent } from './table/parroquia-table.component';


export const ParroquiaRoutes: Routes = [
    {
        path: '',
        component: ParroquiaComponent,
        children: [
            {
                path: '',
                component: ParroquiaTableComponent,
                data: {title: 'Parroquia'}
            },
            {
                path: 'add',
                component: ParroquiaFormComponent,
                data: {title: 'Crear Parroquia'}
            },
            {
                path: ':id/edit',
                component: ParroquiaFormComponent,
                data: {title: 'Editar Municipio'}
            },
            {
                path: ':id/view',
                component: ParroquiaDetailComponent,
                data: {title: 'Visualizar Parroquia'}
            }
        ]
    }
];

