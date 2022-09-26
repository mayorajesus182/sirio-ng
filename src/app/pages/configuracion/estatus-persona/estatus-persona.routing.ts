import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const estatusPersonaRoutes: Routes = [

    {
        path: 'estatus-persona',
        data: { title: 'Estatus de Persona' },
        loadChildren: () => import('./estatus-persona/estatus-persona.module').then(m => m.EstatusPersonaModule),
    },
    

];


@NgModule({
    imports: [RouterModule.forChild(estatusPersonaRoutes)],
    exports: [RouterModule]
})
export class EstatusPersonaRoutingModule {
}
