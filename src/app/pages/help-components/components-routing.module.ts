import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpComponentsComponent } from './components.component';

const routes: Routes = [
  {
    path: '',
    component: HelpComponentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpComponentsRoutingModule {
}
