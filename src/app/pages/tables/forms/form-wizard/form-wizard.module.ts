import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { MaterialModule } from '../../../../../@sirio/shared/material-components.module';
import { FormWizardRoutingModule } from './form-wizard-routing.module';
import { FormWizardComponent } from './form-wizard.component';

@NgModule({
  imports: [
    CommonModule,
    FormWizardRoutingModule,
    SirioSharedModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [FormWizardComponent]
})
export class FormWizardModule {
}
