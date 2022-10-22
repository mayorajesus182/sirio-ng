import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArqueoAtmTableComponent } from './table/arqueo-atm-table.component';




const arqueoAtmRoutes: Routes = [

    {
        path: '',
        component: ArqueoAtmTableComponent,
        data: { title: 'Arqueo ATM' }
    },
    // {
    //     path: 'add',
    //     component: AtmFormComponent,
    //     data: { title: 'Crear ATM' }
    // },
    // {
    //     path: ':id/edit',
    //     component: AtmFormComponent,
    //     data: { title: 'Editar ATM' }
    // },
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

