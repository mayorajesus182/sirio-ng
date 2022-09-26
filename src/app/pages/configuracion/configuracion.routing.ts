import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const configuracionRoutes: Routes = [
    {
        path: 'localizacion',
        data: { title: 'Localización' },
        loadChildren: () => import('./localizacion/localizacion.module').then(m => m.LocalizacionModule),
    },
    {
        path: 'persona-juridica',
        data: { title: 'Persona Jurídica' },
        loadChildren: () => import('./persona-juridica/persona-judirica.module').then(m => m.PersonaJuridicaModule),
    },
    {
        path: 'persona-natural',
        data: { title: 'Persona Natural' },
        loadChildren: () => import('./persona-natural/persona-natural.module').then(m => m.PersonaNaturalModule),
    },
    {
        path: 'estatus-persona',
        data: { title: 'Estatus de Persona' },
        loadChildren: () => import('./estatus-persona/estatus-persona.module').then(m => m.EstatusPersonaModule),
    }

];


@NgModule({
    imports: [RouterModule.forChild(configuracionRoutes)],
    exports: [RouterModule]
})
export class ConfiguracionRoutingModule {
}