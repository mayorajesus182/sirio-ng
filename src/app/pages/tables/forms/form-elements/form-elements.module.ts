import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { BreadcrumbsModule } from '../../../../../@sirio/shared/breadcrumbs/breadcrumbs.module';
import { FuryCardModule } from '../../../../../@sirio/shared/card/card.module';
import { HighlightModule } from '../../../../../@sirio/shared/highlightjs/highlight.module';
import { MaterialModule } from '../../../../../@sirio/shared/material-components.module';
import { FormElementsRoutingModule } from './form-elements-routing.module';
import { FormElementsComponent } from './form-elements.component';

@NgModule({
  imports: [
    CommonModule,
    FormElementsRoutingModule,
    MaterialModule,
    SirioSharedModule,
    ReactiveFormsModule,

    // Core
    HighlightModule,
    FuryCardModule,
    BreadcrumbsModule
  ],
  declarations: [FormElementsComponent]
})
export class FormElementsModule {
}
