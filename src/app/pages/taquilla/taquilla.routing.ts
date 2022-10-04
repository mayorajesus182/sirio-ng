import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const taquillaRoutes: Routes = [
    {
        path: 'retiro',
        data: { title: 'retiro' },
        loadChildren: () => import('./retiro/retiro.module').then(m => m.RetiroModule),
    }
    

];



@NgModule({
    imports: [RouterModule.forChild(taquillaRoutes)],
    exports: [RouterModule]
})
export class TaquillaRoutingModule {
}
