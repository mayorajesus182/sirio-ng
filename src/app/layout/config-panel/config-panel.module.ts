import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { ConfigPanelToggleComponent } from './config-panel-toggle/config-panel-toggle.component';
import { ConfigPanelComponent } from './config-panel.component';

@NgModule({
  imports: [
    CommonModule,
    SirioSharedModule
  ],
  declarations: [ConfigPanelComponent, ConfigPanelToggleComponent],
  exports: [ConfigPanelComponent, ConfigPanelToggleComponent]
})
export class ConfigPanelModule {
}
