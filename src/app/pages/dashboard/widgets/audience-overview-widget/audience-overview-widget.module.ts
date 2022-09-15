import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FuryCardModule } from '../../../../../@sirio/shared/card/card.module';
import { LoadingOverlayModule } from '../../../../../@sirio/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from '../../../../../@sirio/shared/material-components.module';
import { AudienceOverviewWidgetComponent } from './audience-overview-widget.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,

    // Core
    LoadingOverlayModule,
    FuryCardModule,
    ChartsModule,
  ],
  declarations: [AudienceOverviewWidgetComponent],
  exports: [AudienceOverviewWidgetComponent]
})
export class AudienceOverviewWidgetModule {
}
