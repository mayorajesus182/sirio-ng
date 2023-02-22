import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromedioMontoDetailComponent } from './detail/promedio-monto-detail.component';
import { PromedioMontoFormComponent } from './form/promedio-monto-form.component';
import { PromedioMontoTableComponent } from './table/promedio-monto-table.component';


const promedioMontoRoutes: Routes = [

    {
        path: '',
        component: PromedioMontoTableComponent,
        data: { title: 'Promedios de Monto' }
    },
    {
        path: 'add',
        component: PromedioMontoFormComponent,
        data: { title: 'Crear Promedio Monto' }
    },
    {
        path: ':id/edit',
        component: PromedioMontoFormComponent,
        data: { title: 'Editar Promedio Monto' }
    },
    {
        path: ':id/view',
        component: PromedioMontoDetailComponent,
        data: { title: 'Visualizar Promedio Monto' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(promedioMontoRoutes)],
    exports: [RouterModule]
})
export class PromedioMontoRoutingModule {
}

