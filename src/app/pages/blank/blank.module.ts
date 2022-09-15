import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { BlankRoutingModule } from './blank-routing.module';
import { BlankComponent } from './blank.component';

@NgModule({
  imports: [
    CommonModule,
    BlankRoutingModule,
    SirioSharedModule
  ],
  declarations: [BlankComponent]
})
export class BlankModule {
}
