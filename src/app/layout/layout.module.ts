import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIdleModule } from '@ng-idle/core';

import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { BackdropModule } from '../../@sirio/shared/backdrop/backdrop.module';
import { LoadingIndicatorModule } from '../../@sirio/shared/loading-indicator/loading-indicator.module';
import { MaterialModule } from '../../@sirio/shared/material-components.module';
import { ConfigPanelModule } from './config-panel/config-panel.module';
import { FooterModule } from './footer/footer.module';
import { LayoutComponent } from './layout.component';
import { NavigationModule } from './navigation/navigation.module';
import { QuickpanelModule } from './quickpanel/quickpanel.module';
import { SidenavModule } from './sidenav/sidenav.module';
import { ToolbarModule } from './toolbar/toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    LoadingIndicatorModule,
    SirioSharedModule,

    FontAwesomeModule,
    // Core
    ToolbarModule,
    QuickpanelModule,
    SidenavModule,
    FooterModule,
    BackdropModule,
    ConfigPanelModule,
    NavigationModule,
    NgIdleModule.forRoot(),
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 600 (10 minutes), `timeout` is 300 (5 minutes) 
    // and `ping` is 120 (2 minutes).
    
  ],
  declarations: [LayoutComponent]
})
export class LayoutModule {
}
