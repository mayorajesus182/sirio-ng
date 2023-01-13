import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionComercialFormComponent } from './form/gestion-comercial-form.component';




const gestionComercialRoutes: Routes = [

    {
        path: '',
        component: GestionComercialFormComponent,
        data: { title: 'Institucion' }
    },

];


@NgModule({
    imports: [RouterModule.forChild(gestionComercialRoutes)],
    exports: [RouterModule]
})
export class GestionComercialRoutingModule {
}

