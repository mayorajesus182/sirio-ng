import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { ScrollbarModule } from 'src/@sirio/shared/scrollbar/scrollbar.module';
import { MenuWidgetComponent } from './menu-widget.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    TranslateModule,
    // Core
    SirioCardModule,
    ScrollbarModule
  ],
  declarations: [MenuWidgetComponent],
  exports: [MenuWidgetComponent]
})
export class MenuWidgetModule {
}
