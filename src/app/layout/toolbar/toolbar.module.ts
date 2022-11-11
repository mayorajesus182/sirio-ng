import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SirioCardModule } from '../../../@sirio/shared/card/card.module';
import { ClickOutsideModule } from '../../../@sirio/shared/click-outside/click-outside.module';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { ScrollbarModule } from '../../../@sirio/shared/scrollbar/scrollbar.module';
import { ToolbarFullscreenToggleComponent } from './toolbar-fullscreen-toggle/toolbar-fullscreen-toggle.component';
import { ToolbarLangComponent } from './toolbar-lang/toolbar-lang.component';
import { ToolbarNotificationsComponent } from './toolbar-notifications/toolbar-notifications.component';
import { ToolbarQuickpanelToggleComponent } from './toolbar-quickpanel-toggle/toolbar-statics-toggle.component';
import { ToolbarSearchBarComponent } from './toolbar-search-bar/toolbar-search-bar.component';
import { ToolbarSearchComponent } from './toolbar-search/toolbar-search.component';
import { ToolbarSidenavMobileToggleComponent } from './toolbar-sidenav-mobile-toggle/toolbar-sidenav-mobile-toggle.component';
import { ToolbarUserComponent } from './toolbar-user/toolbar-user.component';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule,
    RouterModule,
    ScrollbarModule,
    FormsModule,
    ClickOutsideModule,
    SirioCardModule
  ],
  declarations: [
    ToolbarComponent,
    ToolbarLangComponent,
    ToolbarUserComponent,
    ToolbarNotificationsComponent,
    ToolbarSearchComponent,
    ToolbarSearchBarComponent,
    ToolbarQuickpanelToggleComponent,
    ToolbarFullscreenToggleComponent,
    ToolbarSidenavMobileToggleComponent
  ],
  exports: [ToolbarComponent]
})
export class ToolbarModule {
}
