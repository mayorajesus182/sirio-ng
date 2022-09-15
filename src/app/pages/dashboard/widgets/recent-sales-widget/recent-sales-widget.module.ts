import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FuryCardModule } from '../../../../../@sirio/shared/card/card.module';
import { ListModule } from '../../../../../@sirio/shared/list/list.module';
import { LoadingOverlayModule } from '../../../../../@sirio/shared/loading-overlay/loading-overlay.module';
import { MaterialModule } from '../../../../../@sirio/shared/material-components.module';
import { RecentSalesWidgetTableComponent } from './recent-sales-widget-table/recent-sales-widget-table.component';
import { RecentSalesWidgetComponent } from './recent-sales-widget.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,

    // Core
    LoadingOverlayModule,
    FuryCardModule,
    ListModule,
    ChartsModule
  ],
  declarations: [RecentSalesWidgetComponent, RecentSalesWidgetTableComponent],
  exports: [RecentSalesWidgetComponent]
})
export class RecentSalesWidgetModule {
}
