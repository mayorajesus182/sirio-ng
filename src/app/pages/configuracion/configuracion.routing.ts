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
        data: { title: 'Persona Juridica' },
        loadChildren: () => import('./persona-juridica/persona-judirica.module').then(m => m.PersonaJuridicaModule),
    }

];


@NgModule({
    imports: [RouterModule.forChild(configuracionRoutes)],
    exports: [RouterModule]
})
export class ConfiguracionRoutingModule {
}