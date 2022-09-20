import { Routes } from '@angular/router';
import { MunicipioDetailComponent } from './detail/municipio-detail.component';
import { MunicipioFormComponent } from './form/municipio-form.component';
import { MunicipioComponent } from './municipio.component';
import { MunicipioTableComponent } from './table/municipio-table.component';


export const MunicipioRoutes: Routes = [
    {
        path: '',
        component: MunicipioComponent,
        children: [
            {
                path: '',
                component: MunicipioTableComponent,
                data: {title: 'Municipio'}
            },
            {
                path: 'add',
                component: MunicipioFormComponent,
                data: {title: 'Crear Municipio'}
            },
            {
                path: ':id/edit',
                component: MunicipioFormComponent,
                data: {title: 'Editar Municipio'}
            },
            {
                path: ':id/view',
                component: MunicipioDetailComponent,
                data: {title: 'Visualizar Municipio'}
            }
        ]
    }
];

