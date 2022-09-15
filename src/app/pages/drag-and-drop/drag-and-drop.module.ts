import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { BreadcrumbsModule } from '../../../@sirio/shared/breadcrumbs/breadcrumbs.module';
import { FuryCardModule } from '../../../@sirio/shared/card/card.module';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { ScrollbarModule } from '../../../@sirio/shared/scrollbar/scrollbar.module';
import { DragAndDropRoutingModule } from './drag-and-drop-routing.module';
import { DragAndDropComponent } from './drag-and-drop.component';

@NgModule({
  imports: [
    CommonModule,
    DragAndDropRoutingModule,
    SirioSharedModule,
    MaterialModule,
    ReactiveFormsModule,
    ScrollbarModule,
    DragDropModule,
    BreadcrumbsModule,
    FuryCardModule
  ],
  declarations: [DragAndDropComponent]
})
export class DragAndDropModule {
}
