import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MotivoDevolucionDetailComponent } from './detail/motivo-devolucion-detail.component';
import { MotivoDevolucionFormComponent } from './form/motivo-devolucion-form.component';
import { MotivoDevolucionTableComponent } from './table/motivo-devolucion-table.component';


const motivoDevolucionRoutes: Routes = [

    {
        path: '',
        component: MotivoDevolucionTableComponent,
        data: { title: 'Motivos de Devoluciones' }
    },
    {
        path: 'add',
        component: MotivoDevolucionFormComponent,
        data: { title: 'Crear Motivo de Devolucion' }
    },
    {
        path: ':id/edit',
        component: MotivoDevolucionFormComponent,
        data: { title: 'Editar Motivo de Devolucion' }
    },
    {
        path: ':id/view',
        component: MotivoDevolucionDetailComponent,
        data: { title: 'Visualizar Motivo de Devolucion' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(motivoDevolucionRoutes)],
    exports: [RouterModule]
})
export class MotivoDevolucionRoutingModule {
}

