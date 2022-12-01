import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const productoRoutes: Routes = [

    {
        path: 'tipo-producto',
        data: { title: 'Tipo de Producto' },
        loadChildren: () => import('./tipo-producto/tipo-producto.module').then(m => m.TipoProductoModule),
    },
    {
        path: 'motivo-solicitud',
        data: { title: 'Motivo de Solicitud' },
        loadChildren: () => import('./motivo-solicitud/motivo-solicitud.module').then(m => m.MotivoSolicitudModule),
    },
    {
        path: 'promedio-transaccion',
        data: { title: 'Promedio de Transacción' },
        loadChildren: () => import('./promedio-transaccion/promedio-transaccion.module').then(m => m.PromedioTransaccionModule),
    },
    {
        path: 'cifra-promedio',
        data: { title: 'Cifra Promedio' },
        loadChildren: () => import('./cifra-promedio/cifra-promedio.module').then(m => m.CifraPromedioModule),
    },
    {
        path: 'promedio-monto',
        data: { title: 'Promedio de Monto' },
        loadChildren: () => import('./promedio-monto/promedio-monto.module').then(m => m.PromedioMontoModule),
    },
    {
        path: 'tipo-chequera',
        data: { title: 'Tipo de Chequera' },
        loadChildren: () => import('./tipo-chequera/tipo-chequera.module').then(m => m.TipoChequeraModule),
    },
    {
        path: 'tipo-participacion',
        data: { title: 'Tipo de Participacion' },
        loadChildren: () => import('./tipo-participacion/tipo-participation.module').then(m => m.TipoParticipacionModule),
    },
];


@NgModule({
    imports: [RouterModule.forChild(productoRoutes)],
    exports: [RouterModule]
})
export class ProductoRoutingModule {
}
