import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { ArqueoAtm, ArqueoAtmService, DetalleArqueo } from 'src/@sirio/domain/services/control-efectivo/arqueo-atm.service';
import { EmpleadoTransporte, EmpleadoTransporteService } from 'src/@sirio/domain/services/transporte/empleados/empleado-transporte.service';
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
