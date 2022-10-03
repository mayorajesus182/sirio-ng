import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvaluoDetailComponent } from './detail/avaluo-detail.component';
import { AvaluoFormComponent } from './form/avaluo-form.component';
import { AvaluoTableComponent } from './table/avaluo-table.component';


const avaluoRoutes: Routes = [

    {
        path: '',
        component: AvaluoTableComponent,
        data: { title: 'Avalúos' }
    },
    {
        path: 'add',
        component: AvaluoFormComponent,
        data: { title: 'Crear Avalúo' }
    },
    {
        path: ':id/edit',
        component: AvaluoFormComponent,
        data: { title: 'Editar Avalúo' }
    },
    {
        path: ':id/view',
        component: AvaluoDetailComponent,
        data: { title: 'Visualizar Avalúo' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(avaluoRoutes)],
    exports: [RouterModule]
})
export class AvaluoRoutingModule {
}

