import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { WebcamModule } from "ngx-webcam";
import { SirioCardModule } from "../shared/card/card.module";
import { MaterialModule } from "../shared/material-components.module";
import { SharedComponentModule } from "../shared/shared-components.module";
import { CaptureButtonComponent } from "./capture-image/control/capture-button.component";
import { CaptureImageFormPopupComponent } from "./capture-image/popup/capture-image-form.popup.component";
import { CashButtonComponent } from "./cash/control/cash-button.component";
import { CashDetailComponent } from "./cash/form/cash-detail.form.component";
import { CashFormPopupComponent } from "./cash/popup/cash-form.popup.component";
import { PersonQueryComponent } from "./person/form/person-query.component";
import { VoucherInformationFormComponent } from "./voucher-information/form/voucher-information-form.component";
import { ImageCropperModule } from 'ngx-image-cropper';
const components = [
    CashDetailComponent,
    CashFormPopupComponent,
    CashButtonComponent,
    CaptureButtonComponent,
    CaptureImageFormPopupComponent,
    PersonQueryComponent,
    VoucherInformationFormComponent
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
        SirioCardModule,
        SharedComponentModule,
        WebcamModule,
        ImageCropperModule
    ],

    declarations: components,
    exports: components,
    entryComponents:[CashFormPopupComponent]
})
export class SirioComponentModule {

}