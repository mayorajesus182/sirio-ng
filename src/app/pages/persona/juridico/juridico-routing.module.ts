import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuridicoFormComponent } from './form/juridico-form.component';


const juridicoRoutes: Routes = [

    {
        path: '',
        component: JuridicoFormComponent,
        data: { title: 'Persona Jurídica' }
    },
    {
        path: ':tdoc/:doc/add',
        component: JuridicoFormComponent,
        data: { title: 'Persona Jurídica' }
    },
    {
        path: ':id/edit',
        component: JuridicoFormComponent,
        data: { title: 'Editar Persona Jurídica' }
    },
];


@NgModule({
    imports: [RouterModule.forChild(juridicoRoutes)],
    exports: [RouterModule]
})
export class JuridicoRoutingModule {
}

