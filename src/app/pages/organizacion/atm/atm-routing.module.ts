import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajetinTableComponent } from './cajetin/table/cajetin-table.component';
import { AtmDetailComponent } from './detail/atm-detail.component';
import { AtmFormComponent } from './form/atm-form.component';
import { AtmTableComponent } from './table/atm-table.component';
import { ArqueoAtmConsultaTableComponent } from '../../control-efectivo/arqueo-atm/consulta/table/arqueo-atm-consulta-table.component';
import { ArqueoAtmFormComponent } from '../../control-efectivo/arqueo-atm/form/arqueo-atm-form.component';



const atmRoutes: Routes = [

    {
        path: '',
        component: AtmTableComponent,
        data: { title: 'ATM' }
    },
    {
        path: 'add',
        component: AtmFormComponent,
        data: { title: 'Crear ATM' }
    },
    {
        path: ':id/edit',
        component: AtmFormComponent,
        data: { title: 'Editar ATM' }
    },
    {
        path: ':id/recount',
        component: ArqueoAtmFormComponent,
        data: { title: 'Crear Arqueo ATM' }
    },
    {
        path: ':id/consult',
        component: ArqueoAtmConsultaTableComponent,
        data: { title: 'Consultar Arqueos ATM' }
    },
    {
        path: ':id/boxes',
        component: CajetinTableComponent,
        data: { title: 'Cajetínes' }
    },  
    {
        path: ':id/view',
        component: AtmDetailComponent,
        data: { title: 'Visualizar ATM' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(atmRoutes)],
    exports: [RouterModule]
})
export class AtmRoutingModule {
}

