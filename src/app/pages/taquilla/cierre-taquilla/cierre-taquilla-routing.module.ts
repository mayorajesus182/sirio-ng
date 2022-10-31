import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CierreTaquillaFormComponent } from './form/cierre-taquilla-form.component';




const cierreTaquillaRoutes: Routes = [

   {
        path: '',
        component: CierreTaquillaFormComponent,
        data: { title: 'Cierre de Taquilla' }
    },  


];


@NgModule({
    imports: [RouterModule.forChild(cierreTaquillaRoutes)],
    exports: [RouterModule]
})
export class CierreTaquillaRoutingModule {
}

