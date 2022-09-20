import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SirioCardModule } from '../../../../../@sirio/shared/card/card.module';
import { MaterialModule } from '../../../../../@sirio/shared/material-components.module';
import { RealtimeUsersWidgetComponent } from './realtime-users-widget.component';
import { ScrollbarModule } from '../../../../../@sirio/shared/scrollbar/scrollbar.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,

    // Core
    SirioCardModule,
    ScrollbarModule
  ],
  declarations: [RealtimeUsersWidgetComponent],
  exports: [RealtimeUsersWidgetComponent]
})
export class RealtimeUsersWidgetModule {
}
