import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const remesaRoutes: Routes = [

    {
        path: 'ingresar-compra',
        data: { title: 'Ingresar Compra de Remesa' },
        loadChildren: () => import('./ingresar-compra/ingresar-compra.module').then(m => m.IngresarCompraBcvModule),
    },
    {
        path: 'aprobar-remesa',
        data: { title: 'Aprobar Remesa' },
        loadChildren: () => import('./aprobar-remesa/aprobar-remesa.module').then(m => m.AprobarRemesaModule),
    },
    {
        path: 'solicitar-remesa',
        data: { title: 'Solicitar Remesa' },
        loadChildren: () => import('./solicitar-remesa/solicitar-remesa.module').then(m => m.SolicitarRemesaModule),
    },
    {
        path: 'enviar-remesa',
        data: { title: 'Enviar Remesa' },
        loadChildren: () => import('./enviar-remesa/enviar-remesa.module').then(m => m.EnviarRemesaModule),
    },
    {
        path: 'procesar-remesa',
        data: { title: 'Procesar Remesa' },
        loadChildren: () => import('./procesar-remesa/procesar-remesa.module').then(m => m.ProcesarRemesaModule),
    },
    {
        path: 'recibir-remesa',
        data: { title: 'Despachar Remesa' },
        loadChildren: () => import('./recibir-remesa/recibir-remesa.module').then(m => m.RecibirRemesaModule),
    },
    {
        path: 'consultar-remesa',
        data: { title: 'Consultar Remesa' },
        loadChildren: () => import('./consultar-remesa/consultar-remesa.module').then(m => m.ConsultarRemesaModule),
    },

];


@NgModule({
    imports: [RouterModule.forChild(remesaRoutes)],
    exports: [RouterModule]
})
export class RemesaRoutingModule {
}

