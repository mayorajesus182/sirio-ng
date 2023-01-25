import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { ArqueoAtmService, DetalleArqueo } from 'src/@sirio/domain/services/control-efectivo/arqueo-atm.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
    selector: 'app-arqueo-atm-detail-popup',
    templateUrl: './arqueo-atm-detail-popup.component.html',
    styleUrls: ['./arqueo-atm-detail-popup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ArqueoAtmDetailPopupComponent extends PopupBaseComponent implements OnInit {

    public detalles = new BehaviorSubject<DetalleArqueo[]>([]);
    arqueoAtm: any = {} as any;
    constants = GlobalConstants;
    columnMode = ColumnMode;

    constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
        protected injector: Injector,
        private arqueoAtmService: ArqueoAtmService,
        private cdr: ChangeDetectorRef,
        dialogRef: MatDialogRef<ArqueoAtmDetailPopupComponent>,
        private fb: FormBuilder) {

        super(dialogRef, injector)
    }

    ngOnInit() {
        this.arqueoAtm = this.defaults.payload;

        console.log('  this.defaults.payload  ', this.defaults.payload);
        

        this.arqueoAtmService.allDetalleByArqueo(this.arqueoAtm.id).subscribe(data => {
            this.detalles.next(data);
            this.cdr.detectChanges();
        });
    }

}
