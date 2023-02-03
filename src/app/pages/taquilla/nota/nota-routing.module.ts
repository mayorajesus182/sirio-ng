import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotaFormComponent } from './form/nota-form.component';





const notaRoutes: Routes = [

   {
        path: '',
        component: NotaFormComponent,
        data: { title: 'Notaaaaaaaaa' }
    },  


];


@NgModule({
    imports: [RouterModule.forChild(notaRoutes)],
    exports: [RouterModule]
})
export class NotaRoutingModule {
}

