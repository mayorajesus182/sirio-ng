import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { ConfiguracionRoutingModule } from './configuracion.routing';


@NgModule({
  imports: [
    CommonModule,
    SirioSharedModule,
    ConfiguracionRoutingModule
  ],
  declarations: [
  ],
  exports: []
})
export class ConfiguracionModule {

}