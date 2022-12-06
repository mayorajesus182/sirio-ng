import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AprobarRemesaTableComponent } from './table/aprobar-remesa-table.component';


const aprobarRemesaRoutes: Routes = [

    {
        path: '',
        component: AprobarRemesaTableComponent,
        data: { title: 'Aprobar Remesas' }
    },

];

@NgModule({
    imports: [RouterModule.forChild(aprobarRemesaRoutes)],
    exports: [RouterModule]
})
export class AprobarRemesaRoutingModule {
}

