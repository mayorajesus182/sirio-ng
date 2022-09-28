import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { BreadcrumbsModule } from '../../../@sirio/shared/breadcrumbs/breadcrumbs.module';
import { HighlightModule } from '../../../@sirio/shared/highlightjs/highlight.module';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { ScrollbarModule } from '../../../@sirio/shared/scrollbar/scrollbar.module';
import { HelpComponentsRoutingModule } from './components-routing.module';
import { HelpComponentsComponent } from './components.component';

@NgModule({
  imports: [
    CommonModule,
    HelpComponentsRoutingModule,
    FormsModule,
    SirioSharedModule,
    ReactiveFormsModule,
    MaterialModule,
    // Core
    HighlightModule,
    ScrollbarModule,
    BreadcrumbsModule
  ],
  declarations: [
    HelpComponentsComponent,
  ],
  entryComponents: []
})
export class HelpComponentsModule {
}
