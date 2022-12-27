import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArqueoAtmConsultaTableComponent } from './consulta/table/arqueo-atm-consulta-table.component';
import { ArqueoAtmFormComponent } from './form/arqueo-atm-form.component';
import { ArqueoAtmTableComponent } from './table/arqueo-atm-table.component';




const arqueoAtmRoutes: Routes = [

    {
        path: '',
        component: ArqueoAtmTableComponent,
        data: { title: 'Arqueo ATM' }
    },
    {
        path: ':id/add',
        component: ArqueoAtmFormComponent,
        data: { title: 'Crear Arqueo ATM' }
    },
    {
        path: ':id/view',
        component: ArqueoAtmConsultaTableComponent,
        data: { title: 'Consultar Arqueos ATM' }
    },
    // {
    //     path: ':id/boxes',
    //     component: CajetinTableComponent,
    //     data: { title: 'Cajetínes' }
    // },  
    // {
    //     path: ':id/view',
    //     component: AtmDetailComponent,
    //     data: { title: 'Visualizar ATM' }
    // }

];



@NgModule({
    imports: [RouterModule.forChild(arqueoAtmRoutes)],
    exports: [RouterModule]
})
export class ArqueoAtmRoutingModule {
}

