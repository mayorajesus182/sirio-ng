import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametroFormComponent } from './form/parametro-form.component';



const parametroRoutes: Routes = [

    {
        path: '',
        component: ParametroFormComponent,
        data: { title: 'Parametros' }
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(parametroRoutes)],
    exports: [RouterModule]
})
export class ParametroRoutingModule {
}

