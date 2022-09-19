import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material-components.module';
import { BreadcrumbsComponent } from './breadcrumbs.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    TranslateModule
  ],
  declarations: [BreadcrumbsComponent],
  exports: [BreadcrumbsComponent]
})
export class BreadcrumbsModule {
}
