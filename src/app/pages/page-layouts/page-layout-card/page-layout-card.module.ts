import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { FuryCardModule } from '../../../../@sirio/shared/card/card.module';
import { PageLayoutDemoContentModule } from '../components/page-layout-content/page-layout-demo-content.module';
import { PageLayoutCardRoutingModule } from './page-layout-card-routing.module';
import { PageLayoutCardComponent } from './page-layout-card.component';

@NgModule({
  declarations: [PageLayoutCardComponent],
  imports: [
    CommonModule,
    PageLayoutCardRoutingModule,
    SirioSharedModule,
    FuryCardModule,
    PageLayoutDemoContentModule
  ]
})
export class PageLayoutCardModule {
}
