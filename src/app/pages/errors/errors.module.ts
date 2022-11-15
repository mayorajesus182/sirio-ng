import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorsRoutingModule } from './errors-routing.module';
import { SessionLostComponent } from './session-lost/session-lost.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    ErrorsRoutingModule,
    // Core
    SirioSharedModule,
    SharedComponentModule,
  ],
  declarations: [ForbiddenComponent,
    NotFoundComponent, SessionLostComponent]
})
export class ErrorsModule { }

