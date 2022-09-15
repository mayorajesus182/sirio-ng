import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { MaterialModule } from '../../../@sirio/shared/material-components.module';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';

@NgModule({
  imports: [
    CommonModule,
    EditorRoutingModule,
    MaterialModule,
    QuillModule.forRoot(),
    SirioSharedModule,
    ReactiveFormsModule
  ],
  declarations: [EditorComponent]
})
export class EditorModule {
}
