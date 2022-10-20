import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { MaterialModule } from "../shared/material-components.module";
import { SharedComponentModule } from "../shared/shared-components.module";
import { CashButtonComponent } from "./cash/control/cash-button.component";
import { CashDetailComponent } from "./cash/form/cash-detail.form.component";
import { CashFormPopupComponent } from "./cash/popup/cash-form.popup.component";
import { PersonQueryComponent } from "./person/form/person-query.component";

const components = [
    CashDetailComponent,
    CashFormPopupComponent,
    CashButtonComponent,
    PersonQueryComponent
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
        SharedComponentModule,
    ],

    declarations: components,
    exports: components,
    entryComponents:[CashFormPopupComponent]
})
export class SirioComponentModule {

}