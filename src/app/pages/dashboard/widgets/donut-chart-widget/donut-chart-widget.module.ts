import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SirioCardModule } from '../../../../../@sirio/shared/card/card.module';
import { LoadingOverlayModule } from '../../../../../@sirio/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from '../../../../../@sirio/shared/material-components.module';
import { DonutChartWidgetComponent } from './donut-chart-widget.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,

    // Core
    SirioCardModule,
    LoadingOverlayModule,
    ChartsModule,
  ],
  declarations: [DonutChartWidgetComponent],
  exports: [DonutChartWidgetComponent]
})
export class DonutChartWidgetModule {
}
