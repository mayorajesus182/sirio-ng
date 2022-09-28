import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstitucionFormComponent } from './form/institucion-form.component';




const institucionRoutes: Routes = [

   {
        path: '',
        component: InstitucionFormComponent,
        data: { title: 'Institucion' }
    },
  


];


@NgModule({
    imports: [RouterModule.forChild(institucionRoutes)],
    exports: [RouterModule]
})
export class InstitucionRoutingModule {
}

