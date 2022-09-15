import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { PageLayoutDemoContentModule } from '../components/page-layout-content/page-layout-demo-content.module';
import { PageLayoutSimpleTabbedRoutingModule } from './page-layout-simple-tabbed-routing.module';
import { PageLayoutSimpleTabbedComponent } from './page-layout-simple-tabbed.component';

@NgModule({
  declarations: [PageLayoutSimpleTabbedComponent],
  imports: [
    CommonModule,
    PageLayoutSimpleTabbedRoutingModule,
    MatTabsModule,
    SirioSharedModule,
    PageLayoutDemoContentModule
  ]
})
export class PageLayoutSimpleTabbedModule {
}
