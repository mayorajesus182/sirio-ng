import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IngresarCompraBcvFormComponent } from './form/ingresar-compra-form.component';


const ingresarCompraBcvRoutes: Routes = [

    {
        path: '',
        component: IngresarCompraBcvFormComponent,
        data: { title: 'Ingresar Compra BCV' }
    },

];

@NgModule({
    imports: [RouterModule.forChild(ingresarCompraBcvRoutes)],
    exports: [RouterModule]
})
export class IngresarCompraBcvRoutingModule {
}

