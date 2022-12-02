import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultarRemesaTableComponent } from './table/consultar-remesa-table.component';


const consultarRemesaRoutes: Routes = [

    {
        path: '',
        component: ConsultarRemesaTableComponent,
        data: { title: 'Consultar Remesas' }
    },

];

@NgModule({
    imports: [RouterModule.forChild(consultarRemesaRoutes)],
    exports: [RouterModule]
})
export class ConsultarRemesaRoutingModule {
}

