import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const personaRoutes: Routes = [

    {
        path: 'tenencia',
        data: { title: 'Persona' },
        loadChildren: () => import('./persona.module').then(m => m.PersonaModule),
    },

];

@NgModule({
    imports: [RouterModule.forChild(personaRoutes)],
    exports: [RouterModule]
})
export class PersonaRoutingModule {
}