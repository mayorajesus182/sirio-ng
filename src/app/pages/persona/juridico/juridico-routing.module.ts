import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuridicoFormComponent } from './form/juridico-form.component';


const juridicoRoutes: Routes = [

    {
        path: '',
        component: JuridicoFormComponent,
        data: { title: 'Persona Jurídico' }
    },
    {
        path: ':id/edit',
        component: JuridicoFormComponent,
        data: { title: 'Persona Natural' }
    },
];


@NgModule({
    imports: [RouterModule.forChild(juridicoRoutes)],
    exports: [RouterModule]
})
export class JuridicoRoutingModule {
}

