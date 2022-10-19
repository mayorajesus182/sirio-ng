import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { ScrollbarModule } from '../../../@sirio/shared/scrollbar/scrollbar.module';
import { QuickpanelComponent } from './task-panel.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ScrollbarModule
  ],
  declarations: [QuickpanelComponent],
  exports: [QuickpanelComponent]
})
export class TaskPanelModule {
}
