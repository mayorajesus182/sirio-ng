import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const preferenciaModuleRoutes: Routes = [

    {
        path: 'idioma',
        data: { title: 'Idioma' },
        loadChildren: () => import('./idioma/idioma.module').then(m => m.IdiomaModule),
    },
    // {
    //     path: 'internacionalizacion',
    //     data: {title: 'Internacionalización'},
    //     loadChildren: () => import('./internacionalizacion/internacionalizacion.module').then(m => m.InternacionalizacionModule),
    // },


];


@NgModule({
    imports: [RouterModule.forChild(preferenciaModuleRoutes)],
    exports: [RouterModule]
})
export class PreferenciaRoutingModule {
}

