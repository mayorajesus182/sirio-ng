import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasaDPFTableComponent } from './table/tasa-dpf-table.component';
import { TasaDPFFormComponent } from './form/tasa-dpf-form.component';
import { TasaDPFDetailComponent } from './detail/tasa-dpf-detail.component';




const tasaDPFRoutes: Routes = [

    {
        path: '',
        component: TasaDPFTableComponent,
        data: { title: 'Tasas' }
    },
    {
        path: 'add',
        component: TasaDPFFormComponent,
        data: { title: 'Crear Tasa' }
    },
    {
        path: ':id/edit',
        component: TasaDPFFormComponent,
        data: { title: 'Editar Tasa' }
    },
    {
        path: ':id/view',
        component: TasaDPFDetailComponent,
        data: { title: 'Visualizar Tasa' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tasaDPFRoutes)],
    exports: [RouterModule]
})
export class TasaDPFRoutingModule {
}

