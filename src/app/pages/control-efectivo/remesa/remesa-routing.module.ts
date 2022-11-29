import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const remesaRoutes: Routes = [


];


@NgModule({
    imports: [RouterModule.forChild(remesaRoutes)],
    exports: [RouterModule]
})
export class RemesaRoutingModule {
}

