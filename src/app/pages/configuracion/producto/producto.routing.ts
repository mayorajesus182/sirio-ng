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
   

];


@NgModule({
    imports: [RouterModule.forChild(productoRoutes)],
    exports: [RouterModule]
})
export class ProductoRoutingModule {
}
