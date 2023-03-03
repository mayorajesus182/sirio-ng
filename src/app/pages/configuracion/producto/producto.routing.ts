import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const productoRoutes: Routes = [

    {
        path: 'tipo-producto',
        data: { title: 'Tipo de Producto' },
        loadChildren: () => import('./tipo-producto/tipo-producto.module').then(m => m.TipoProductoModule),
    },
    {
        path: 'tipo-chequera',
        data: { title: 'Tipo de Chequera' },
        loadChildren: () => import('./tipo-chequera/tipo-chequera.module').then(m => m.TipoChequeraModule),
    },
    {
        path: 'tipo-subproducto',
        data: { title: 'Origen de Fondo' },
        loadChildren: () => import('./tipo-subproducto/tipo-subproducto.module').then(m => m.TipoSubproductoModule),
    },
    {
        path: 'plazo',
        data: { title: 'Plazos' },
        loadChildren: () => import('./plazo/plazo.module').then(m => m.PlazoModule),
    },
];


@NgModule({
    imports: [RouterModule.forChild(productoRoutes)],
    exports: [RouterModule]
})
export class ProductoRoutingModule {
}
