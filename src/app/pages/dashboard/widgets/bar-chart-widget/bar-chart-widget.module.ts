import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingOverlayModule } from '../../../../../@sirio/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from '../../../../../@sirio/shared/material-components.module';
import { BarChartWidgetComponent } from './bar-chart-widget.component';
import { SirioCardModule } from '../../../../../@sirio/shared/card/card.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,

    // Core
    LoadingOverlayModule,

    // Chart Widget Style
    SirioCardModule,
    ChartsModule
  ],
  declarations: [BarChartWidgetComponent],
  exports: [BarChartWidgetComponent]
})
export class BarChartWidgetModule {
}
