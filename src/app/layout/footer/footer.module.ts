import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {
}
