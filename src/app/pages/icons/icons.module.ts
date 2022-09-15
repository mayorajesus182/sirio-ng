import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsModule } from '../../../@sirio/shared/breadcrumbs/breadcrumbs.module';
import { FuryCardModule } from '../../../@sirio/shared/card/card.module';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { IconsRoutingModule } from './icons-routing.module';
import { IconsComponent } from './icons.component';
import { ScrollbarModule } from '../../../@sirio/shared/scrollbar/scrollbar.module';

@NgModule({
  imports: [
    CommonModule,
    IconsRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    BreadcrumbsModule,
    FuryCardModule,
    ScrollbarModule
  ],
  declarations: [IconsComponent]
})
export class IconsModule {
}
