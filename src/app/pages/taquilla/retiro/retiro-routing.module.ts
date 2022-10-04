import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RetiroFormComponent } from './form/retiro-form.component';




const retiroRoutes: Routes = [

   {
        path: '',
        component: RetiroFormComponent,
        data: { title: 'Retiro' }
    },  


];


@NgModule({
    imports: [RouterModule.forChild(retiroRoutes)],
    exports: [RouterModule]
})
export class RetiroRoutingModule {
}

