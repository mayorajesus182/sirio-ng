import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { SirioCardModule } from '../../../@sirio/shared/card/card.module';
import { ComingSoonRoutingModule } from './coming-soon-routing.module';
import { ComingSoonComponent } from './coming-soon.component';

@NgModule({
  imports: [
    CommonModule,
    ComingSoonRoutingModule,
    SirioSharedModule,
    SirioCardModule
  ],
  declarations: [ComingSoonComponent]
})
export class ComingSoonModule {
}
