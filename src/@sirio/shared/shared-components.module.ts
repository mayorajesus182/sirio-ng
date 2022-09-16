import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ListComponent } from './list/list.component';
import { MaterialModule } from './material-components.module';
import { SelectSearchComponent } from './select/select-search.component';
import { SelectSimpleComponent } from './select/select-simple.component';

const components = [
  SelectSearchComponent,
  SelectSimpleComponent,
  ListComponent
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    FlexLayoutModule,
    MaterialModule
  ],
declarations: components,
  exports: components
})
export class SharedComponentModule {
}
