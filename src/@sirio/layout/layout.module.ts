import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { BackdropModule } from '../shared/backdrop/backdrop.module';
import { LoadingIndicatorModule } from '../shared/loading-indicator/loading-indicator.module';
import { MaterialModule } from '../shared/material-components.module';
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

    // Core
    ToolbarModule,
    QuickpanelModule,
    SidenavModule,
    FooterModule,
    BackdropModule,
    ConfigPanelModule,
    NavigationModule
  ],
  declarations: [LayoutComponent]
})
export class LayoutModule {
}
