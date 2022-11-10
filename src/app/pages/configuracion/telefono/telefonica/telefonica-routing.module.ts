import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelefonicaDetailComponent } from './detail/telefonica-detail.component';
import { TelefonicaFormComponent } from './form/telefonica-form.component';
import { TelefonicaTableComponent } from './table/telefonica-table.component';


const telefonicaRoutes: Routes = [

    {
        path: '',
        component: TelefonicaTableComponent,
        data: { title: 'Telefónicas' }
    },
    {
        path: 'add',
        component: TelefonicaFormComponent,
        data: { title: 'Crear Telefónica' }
    },
    {
        path: ':id/edit',
        component: TelefonicaFormComponent,
        data: { title: 'Editar Telefónica' }
    },
    {
        path: ':id/view',
        component: TelefonicaDetailComponent,
        data: { title: 'Visualizar Telefónica' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(telefonicaRoutes)],
    exports: [RouterModule]
})
export class TelefonicaRoutingModule {
}

