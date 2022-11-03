import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const personaRoutes: Routes = [

    {
        path: 'natural',
        data: { title: 'Persona Natural' },
        loadChildren: () => import('./natural/natural.module').then(m => m.NaturalModule),
    },
    {
        path: 'juridica',
        data: { title: 'Persona Jurídica' },
        loadChildren: () => import('./juridico/juridico.module').then(m => m.JuridicoModule),
    },

];

@NgModule({
    imports: [RouterModule.forChild(personaRoutes)],
    exports: [RouterModule]
})
export class PersonaRoutingModule {
}