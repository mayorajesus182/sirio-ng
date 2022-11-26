import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnviarRemesaFormComponent } from './form/enviar-remesa-form.component';


const enviarRemesaRoutes: Routes = [

    {
        path: '',
        component: EnviarRemesaFormComponent,
        data: { title: 'Enviar Remesas' }
    },
];

@NgModule({
    imports: [RouterModule.forChild(enviarRemesaRoutes)],
    exports: [RouterModule]
})
export class EnviarRemesaRoutingModule {
}

