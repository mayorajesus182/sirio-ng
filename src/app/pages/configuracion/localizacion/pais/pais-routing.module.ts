import { Routes } from '@angular/router';
import { PaisDetailComponent } from './detail/pais-detail.component';
import { PaisFormComponent } from './form/pais-form.component';
import { PaisComponent } from './pais.component';
import { PaisTableComponent } from './table/pais-table.component';


export const PaisRoutes: Routes = [
    {
        path: '',
        component: PaisComponent,
        children: [
            {
                path: '',
                component: PaisTableComponent,
                data: {title: 'Países'}
            },
            {
                path: 'add',
                component: PaisFormComponent,
                data: {title: 'Crear País'}
            },
            {
                path: ':id/edit',
                component: PaisFormComponent,
                data: {title: 'Editar País'}
            },
            {
                path: ':id/view',
                component: PaisDetailComponent,
                data: {title: 'Visualizar País'}
            }
        ]
    }
];

