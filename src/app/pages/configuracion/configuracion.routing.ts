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
    },
    {
        path: 'entidad-financiera',
        data: { title: 'Entidad Financiera' },
        loadChildren: () => import('./entidad-financiera/entidad-financiera.module').then(m => m.EntidadFinancieraModule),
    },
    {
        path: 'tipo-documento',
        data: { title: 'Tipo de Documento' },
        loadChildren: () => import('./tipo-documento/tipo-documento.module').then(m => m.TipoDocumentoModule),
    },
    {
        path: 'tipo-persona',
        data: { title: 'Tipo de Persona' },
        loadChildren: () => import('./tipo-persona/tipo-persona.module').then(m => m.TipoPersonaModule),
    },
    {
        path: 'divisa',
        data: { title: 'Divisa' },
        loadChildren: () => import('./divisa/divisa.module').then(m => m.DivisaModule),
    }

];


@NgModule({
    imports: [RouterModule.forChild(configuracionRoutes)],
    exports: [RouterModule]
})
export class ConfiguracionRoutingModule {
}