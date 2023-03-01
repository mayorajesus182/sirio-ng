import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequisitoPersonaFormComponent } from './form/requisito-persona-form.component';


const requisitoPersonaRoutes: Routes = [

    {
        path: '',
        component: RequisitoPersonaFormComponent,
        data: { title: 'Actualizar Requisitos de Personas' }
    },

];



@NgModule({
    imports: [RouterModule.forChild(requisitoPersonaRoutes)],
    exports: [RouterModule]
})
export class RequisitoPersonaRoutingModule {
}

