import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { SirioCardModule } from 'src/@sirio/shared/card/card.module';
import { HighlightModule } from 'src/@sirio/shared/highlightjs/highlight.module';
import { MaterialModule } from 'src/@sirio/shared/material-components.module';
import { SharedComponentModule } from 'src/@sirio/shared/shared-components.module';
import { SirioSharedModule } from 'src/@sirio/sirio-shared.module';
import { NotaDetailComponent } from './detail/nota-detail.component';
import { NotaFormComponent } from './form/nota-form.component';



import { NotaRoutingModule } from './nota-routing.module';
import { NotaTableComponent } from './table/nota-table.component';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        FlexLayoutModule,
        MaterialModule,
        // Core
        SirioSharedModule,
        SharedComponentModule,
               
        HighlightModule,
        SirioCardModule,
        NotaRoutingModule
    ],
    declarations: [
        NotaFormComponent,
        NotaTableComponent,
       //NotaCreditorFormComponent // componente de credito
       // NotaCreditoFormComponent, 
       NotaDetailComponent,
          
    ],
    exports: [],
    // providers:[ { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }]
})

export class NotaModule {

}
