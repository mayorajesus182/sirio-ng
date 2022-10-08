import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "../shared/material-components.module";
import { CashDetailComponent } from "./cash/cash-detail.component";

const components = [
    CashDetailComponent
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        FlexLayoutModule,
        MaterialModule,
    ],

    declarations: components,
    exports: components,
    entryComponents:[CashDetailComponent]
})
export class SirioComponentModule {

}