import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViaDetailComponent } from './detail/via-detail.component';
import { ViaFormComponent } from './form/via-form.component';
import { ViaTableComponent } from './table/via-table.component';


const viaRoutes: Routes = [

    {
        path: '',
        component: ViaTableComponent,
        data: { title: 'Vías' }
    },
    {
        path: 'add',
        component: ViaFormComponent,
        data: { title: 'Crear Vía' }
    },
    {
        path: ':id/edit',
        component: ViaFormComponent,
        data: { title: 'Editar Vía' }
    },
    {
        path: ':id/view',
        component: ViaDetailComponent,
        data: { title: 'Visualizar Vía' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(viaRoutes)],
    exports: [RouterModule]
})
export class ViaRoutingModule {
}

