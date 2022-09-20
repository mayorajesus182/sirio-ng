import { Routes } from '@angular/router';
import { NucleoDetailComponent } from './detail/nucleo-detail.component';
import { NucleoFormComponent } from './form/nucleo-form.component';
import { NucleoComponent } from './nucleo.component';
import { NucleoTableComponent } from './table/nucleo-table.component';


export const NucleoRoutes: Routes = [
    {
        path: '',
        component: NucleoComponent,
        children: [
            {
                path: '',
                component: NucleoTableComponent,
                data: {title: 'Núcleos'}
            },
            {
                path: 'add',
                component: NucleoFormComponent,
                data: {title: 'Crear Núcleo'}
            },
            {
                path: ':id/edit',
                component: NucleoFormComponent,
                data: {title: 'Editar Núcleo'}
            },
            {
                path: ':id/view',
                component: NucleoDetailComponent,
                data: {title: 'Visualizar Núcleo'}
            }
        ]
    }
];

