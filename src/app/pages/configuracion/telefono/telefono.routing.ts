import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const telefonoRoutes: Routes = [

    {
        path: 'tipo-telefono',
        data: { title: 'Tipo de Teléfono' },
        loadChildren: () => import('./tipo-telefono/tipo-telefono.module').then(m => m.TipoTelefonoModule),
    },   
    {
        path: 'clase-telefono',
        data: { title: 'Clase de Teléfono' },
        loadChildren: () => import('./clase-telefono/clase-telefono.module').then(m => m.ClaseTelefonoModule),
    },
    {
        path: 'telefonica',
        data: { title: 'Telefónica' },
        loadChildren: () => import('./telefonica/telefonica.module').then(m => m.TelefonicaModule),
    },
];

@NgModule({
    imports: [RouterModule.forChild(telefonoRoutes)],
    exports: [RouterModule]
})
export class TelefonoRoutingModule {
}
