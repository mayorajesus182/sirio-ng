import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CierreAgenciaFormComponent } from './form/cierre-agencia-form.component';




const cierreAgenciaRoutes: Routes = [

   {
        path: '',
        component: CierreAgenciaFormComponent,
        data: { title: 'Cierre de Agencia' }
    },  
];

@NgModule({
    imports: [RouterModule.forChild(cierreAgenciaRoutes)],
    exports: [RouterModule]
})
export class CierreAgenciaRoutingModule {
}

