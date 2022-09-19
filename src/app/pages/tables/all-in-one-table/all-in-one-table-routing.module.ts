import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllInOneTableComponent } from './all-in-one-table.component';

const routes: Routes = [
  {
    path: '',
    component: AllInOneTableComponent,
    data: { title: 'Lista' }
  },
  {
    path: 'registrar',
    loadChildren: () => import('../forms/form-elements/form-elements.module').then(m => m.FormElementsModule),
    data: { title: 'action.add' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllInOneTableRoutingModule {
}
