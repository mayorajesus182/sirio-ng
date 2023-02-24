import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlazoDPFDetailComponent } from './detail/plazo-dpf-detail.component';
import { PlazoDPFFormComponent } from './form/plazo-dpf-form.component';
import { PlazoDPFTableComponent } from './table/plazo-dpf-table.component';



const plazoDPFRoutes: Routes = [

    {
        path: '',
        component: PlazoDPFTableComponent,
        data: { title: 'Plazos' }
    },
    {
        path: 'add',
        component: PlazoDPFFormComponent,
        data: { title: 'Crear Plazo' }
    },
    {
        path: ':id/edit',
        component: PlazoDPFFormComponent,
        data: { title: 'Editar Plazo' }
    },
    {
        path: ':id/view',
        component: PlazoDPFDetailComponent,
        data: { title: 'Visualizar Plazo' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(plazoDPFRoutes)],
    exports: [RouterModule]
})
export class PlazoDPFRoutingModule {
}

