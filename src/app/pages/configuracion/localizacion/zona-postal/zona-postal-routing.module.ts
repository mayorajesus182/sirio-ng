import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZonaPostalDetailComponent } from './detail/zona-postal-detail.component';
import { ZonaPostalFormComponent } from './form/zona-postal-form.component';
import { ZonaPostalTableComponent } from './table/zona-postal-table.component';

const zonaPostalRoutes: Routes = [

    {
        path: '',
        component: ZonaPostalTableComponent,
        data: { title: 'Zonas Postales' }
    },
    {
        path: 'add',
        component: ZonaPostalFormComponent,
        data: { title: 'Crear Zona Postal' }
    },
    {
        path: ':id/edit',
        component: ZonaPostalFormComponent,
        data: { title: 'Editar Zona Postal' }
    },
    {
        path: ':id/view',
        component: ZonaPostalDetailComponent,
        data: { title: 'Visualizar Zona Postal' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(zonaPostalRoutes)],
    exports: [RouterModule]
})
export class ZonaPostalRoutingModule {
}

