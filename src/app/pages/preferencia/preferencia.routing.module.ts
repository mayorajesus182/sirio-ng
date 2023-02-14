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
    {
        path: 'parametros',
        data: { title: 'Parametro' },
        loadChildren: () => import('./parametro/parametro.module').then(m => m.ParametroModule),
    },
    

];


@NgModule({
    imports: [RouterModule.forChild(preferenciaModuleRoutes)],
    exports: [RouterModule]
})
export class PreferenciaRoutingModule {
}

