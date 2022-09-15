import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatTabsModule } from '@angular/material/tabs';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { FuryCardModule } from '../../../../@sirio/shared/card/card.module';
import { PageLayoutDemoContentModule } from '../components/page-layout-content/page-layout-demo-content.module';
import { PageLayoutCardTabbedRoutingModule } from './page-layout-card-tabbed-routing.module';
import { PageLayoutCardTabbedComponent } from './page-layout-card-tabbed.component';

@NgModule({
  declarations: [PageLayoutCardTabbedComponent],
  imports: [
    CommonModule,
    PageLayoutCardTabbedRoutingModule,
    SirioSharedModule,
    FuryCardModule,
    PageLayoutDemoContentModule,
    MatTabsModule
  ]
})
export class PageLayoutCardTabbedModule {
}
