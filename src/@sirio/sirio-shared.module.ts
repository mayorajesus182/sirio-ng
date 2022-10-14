import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { BreadcrumbsModule } from './shared/breadcrumbs/breadcrumbs.module';
import { PageLayoutModule } from './shared/page-layout/page-layout.module';
import { PageModule } from './shared/page/page.module';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { TitleModule } from './shared/title/title.module';

import { TranslateModule } from '@ngx-translate/core';
import { SirioComponentModule } from './components/sirio.component.modulo';
import { BoxOfficeGuard } from './guards/boxoffice.guard';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    AuthGuard,
    BoxOfficeGuard,
  ],

  declarations: [],
  exports: [
    BreadcrumbsModule,
    TitleModule,
    PageModule,
    SidebarModule,
    RouterModule,
    PageLayoutModule,
    TranslateModule,
    // External
    FlexLayoutModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatMenuModule,
    ScrollingModule,
    SirioComponentModule
  ]
})
export class SirioSharedModule {
  
}
