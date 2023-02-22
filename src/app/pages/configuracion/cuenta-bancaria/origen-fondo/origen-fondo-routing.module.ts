import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrigenFondoDetailComponent } from './detail/origen-fondo-detail.component';
import { OrigenFondoFormComponent } from './form/origen-fondo-form.component';
import { OrigenFondoTableComponent } from './table/origen-fondo-table.component';




const origenFondoRoutes: Routes = [

    {
        path: '',
        component: OrigenFondoTableComponent,
        data: { title: 'Origenes de Fondo' }
    },
    {
        path: 'add',
        component: OrigenFondoFormComponent,
        data: { title: 'Crear Origen de Fondo' }
    },
    {
        path: ':id/edit',
        component: OrigenFondoFormComponent,
        data: { title: 'Editar Origen de Fondo' }
    },
    {
        path: ':id/view',
        component: OrigenFondoDetailComponent,
        data: { title: 'Visualizar Origen de Fondo' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(origenFondoRoutes)],
    exports: [RouterModule]
})
export class OrigenFondoRoutingModule {
}

