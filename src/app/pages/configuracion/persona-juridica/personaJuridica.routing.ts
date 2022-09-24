import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const configuracionRoutes: Routes = [

    {
        path: 'ramo',
        data: { title: 'Ramo' },
        loadChildren: () => import('./ramo/ramo.module').then(m => m.RamoModule),
    },
   

];


@NgModule({
    imports: [RouterModule.forChild(configuracionRoutes)],
    exports: [RouterModule]
})
export class PersonaJuridicaRoutingModule {
}
