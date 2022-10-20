import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaseTelefonoDetailComponent } from './detail/clase-telefono-detail.component';
import { ClaseTelefonoFormComponent } from './form/clase-telefono-form.component';
import { ClaseTelefonoTableComponent } from './table/clase-telefono-table.component';


const claseTelefonoRoutes: Routes = [

    {
        path: '',
        component: ClaseTelefonoTableComponent,
        data: { title: 'Clases de Teléfono' }
    },
    {
        path: 'add',
        component: ClaseTelefonoFormComponent,
        data: { title: 'Crear Clase de Teléfono' }
    },
    {
        path: ':id/edit',
        component: ClaseTelefonoFormComponent,
        data: { title: 'Editar Clase de Teléfono' }
    },
    {
        path: ':id/view',
        component: ClaseTelefonoDetailComponent,
        data: { title: 'Visualizar Clase de Teléfono' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(claseTelefonoRoutes)],
    exports: [RouterModule]
})
export class ClaseTelefonoRoutingModule {
}

