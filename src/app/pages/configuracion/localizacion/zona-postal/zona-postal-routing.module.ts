import { Routes } from '@angular/router';
import { ZonaPostalDetailComponent } from './detail/zona-postal-detail.component';
import { ZonaPostalFormComponent } from './form/zona-postal-form.component';
import { ZonaPostalComponent } from './zona-postal.component';
import { ZonaPostalTableComponent } from './table/zona-postal-table.component';


export const ZonaPostalRoutes: Routes = [
    {
        path: '',
        component: ZonaPostalComponent,
        children: [
            {
                path: '',
                component: ZonaPostalTableComponent,
                data: {title: 'Zona Postal'}
            },
            {
                path: 'add',
                component: ZonaPostalFormComponent,
                data: {title: 'Crear Zona Postal'}
            },
            {
                path: ':id/edit',
                component: ZonaPostalFormComponent,
                data: {title: 'Editar Zona Postal'}
            },
            {
                path: ':id/view',
                component: ZonaPostalDetailComponent,
                data: {title: 'Visualizar Zona Postal'}
            }
        ]
    }
];

