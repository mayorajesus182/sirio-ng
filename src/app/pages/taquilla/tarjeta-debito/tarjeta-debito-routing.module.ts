import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TarjetaDebitoFormComponent } from './form/tarjeta-debito-form.component';


const tarjetaDebitoRoutes: Routes = [

    {
        path: '',
        component: TarjetaDebitoFormComponent,
        data: { title: 'Tarjeta de Débito' }
    }

];



@NgModule({
    imports: [RouterModule.forChild(tarjetaDebitoRoutes)],
    exports: [RouterModule]
})
export class TarjetaDebitoRoutingModule {
}

