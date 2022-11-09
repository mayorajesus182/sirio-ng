import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaseABovedaDetailComponent } from './detail/pase-boveda-detail.component';
import { PaseABovedaFormComponent } from './form/pase-boveda-form.component';
import { PaseABovedaTableComponent } from './table/pase-boveda-table.component';


const paseBovedaRoutes: Routes = [

    {
        path: '',
        component: PaseABovedaTableComponent,
        data: { title: 'Pases a Bóveda' }
    },
    {
        path: 'add',
        component: PaseABovedaFormComponent,
        data: { title: 'Crear Pase a Bóveda' }
    },
    {
        path: ':id/view',
        component: PaseABovedaDetailComponent,
        data: { title: 'Visualizar Pase a Bóveda' }
    }

];


@NgModule({
    imports: [RouterModule.forChild(paseBovedaRoutes)],
    exports: [RouterModule]
})
export class PaseABovedaRoutingModule {
}

