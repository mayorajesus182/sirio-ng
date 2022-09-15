import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { PageLayoutDemoContentModule } from '../components/page-layout-content/page-layout-demo-content.module';
import { PageLayoutSimpleRoutingModule } from './page-layout-simple-routing.module';
import { PageLayoutSimpleComponent } from './page-layout-simple.component';

@NgModule({
  declarations: [PageLayoutSimpleComponent],
  imports: [
    CommonModule,
    PageLayoutSimpleRoutingModule,
    SirioSharedModule,
    PageLayoutDemoContentModule
  ]
})
export class PageLayoutSimpleModule {
}
