import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtmDetailComponent } from './detail/atm-detail.component';
import { AtmFormComponent } from './form/atm-form.component';
import { AtmTableComponent } from './table/atm-table.component';



const atmRoutes: Routes = [

    {
        path: '',
        component: AtmTableComponent,
        data: { title: 'Atmes' }
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

