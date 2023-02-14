import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const recaudoRoutes: Routes = [

    {
        path: 'nivel-persona',
        data: { title: 'Nivel de Persona' },
        loadChildren: () => import('./nivel-persona/nivel-persona.module').then(m => m.NivelPersonaModule),
    },
    {
        path: 'tipo-recaudo',
        data: { title: 'Tipo de Recaudo' },
        loadChildren: () => import('./tipo-recaudo/tipo-recaudo.module').then(m => m.TipoRecaudoModule),
    },
    {
        path: 'dato-persona',
        data: { title: 'Dato de Persona' },
        loadChildren: () => import('./dato-persona/dato-persona.module').then(m => m.DatoPersonaModule),
    },
];


@NgModule({
    imports: [RouterModule.forChild(recaudoRoutes)],
    exports: [RouterModule]
})
export class RecaudoRoutingModule {
}
