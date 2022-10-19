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
];

@NgModule({
    imports: [RouterModule.forChild(telefonoRoutes)],
    exports: [RouterModule]
})
export class TelefonoRoutingModule {
}
