import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NaturalFormComponent } from './form/natural-form.component';


const naturalRoutes: Routes = [
    {
        path: '',
        component: NaturalFormComponent,
        data: { title: 'Persona Natural' }
    },
    {
        path: ':tdoc/:doc/add',
        component: NaturalFormComponent,
        data: { title: 'Persona Natural' }
    },
    {
        path: ':id/edit',
        component: NaturalFormComponent,
        data: { title: 'Persona Natural' }
    },
];


@NgModule({
    imports: [RouterModule.forChild(naturalRoutes)],
    exports: [RouterModule]
})
export class NaturalRoutingModule {
}

