import { Routes } from '@angular/router';
import { EstadoDetailComponent } from './detail/estado-detail.component';
import { EstadoComponent } from './estado.component';
import { EstadoFormComponent } from './form/estado-form.component';
import { EstadoTableComponent } from './table/estado-table.component';


export const EstadoRoutes: Routes = [
    {
        path: '',
        component: EstadoComponent,
        children: [
            {
                path: '',
                component: EstadoTableComponent,
                data: {title: 'Estados'}
            },
            {
                path: 'add',
                component: EstadoFormComponent,
                data: {title: 'Crear Estado'}
            },
            {
                path: ':id/edit',
                component: EstadoFormComponent,
                data: {title: 'Editar Estado'}
            },
            {
                path: ':id/view',
                component: EstadoDetailComponent,
                data: {title: 'Visualizar Estado'}
            }
        ]
    }
];

