import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { SolicitudRemesa, SolicitudRemesaService } from 'src/@sirio/domain/services/control-efectivo/solicitud-remesa.service copy';
import { CupoAgencia, CupoAgenciaService } from 'src/@sirio/domain/services/organizacion/cupo-agencia.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-solicitud-remesa-form',
    templateUrl: './solicitud-remesa-form.component.html',
    styleUrls: ['./solicitud-remesa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class SolicitudRemesaFormComponent extends FormBaseComponent implements OnInit {

    solicitudRemesa: SolicitudRemesa = {} as SolicitudRemesa;
    public detalles = new BehaviorSubject<CupoAgencia[]>([]);
    public transportistas = new BehaviorSubject<Transportista[]>([]);
    monto: number = 0;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private solicitudRemesaService: SolicitudRemesaService,
        private transportistaService: TransportistaService,
        private cupoAgenciaService: CupoAgenciaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    // TODO: AGREGAR ETIQUETAS FALTANTES EN EL HTML (desglose de efectivo)

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.solicitudRemesaService.get(id).subscribe((agn: SolicitudRemesa) => {
                this.solicitudRemesa = agn;
                this.buildForm(this.solicitudRemesa);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.solicitudRemesa);
            this.loadingDataForm.next(false);
        }

        this.cupoAgenciaService.activesParaRemesa().subscribe(data => {
            this.detalles.next(data);
            this.cdr.detectChanges();
        });

        this.transportistaService.allCentrosAcopio().subscribe(data => {
            this.transportistas.next(data);
            this.cdr.detectChanges();
        });
    }

    buildForm(solicitudRemesa: SolicitudRemesa) {
        this.itemForm = this.fb.group({
            transportista: new FormControl(''),
            fecha: new FormControl(''),
        });
    }


    setMontoSolicitado() {
        this.monto = 0;
        this.detalles.subscribe(d => {
            this.monto = d.filter(c1 => c1.solicitado > 0).map(c2 => c2.solicitado).reduce((a, b) => a + b);
            this.cdr.detectChanges();
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.solicitudRemesa);
        this.solicitudRemesa.fecha = this.solicitudRemesa.fecha.format('DD/MM/YYYY');

        this.detalles.subscribe(d => {
            this.solicitudRemesa.detalleSolicitud = d.filter(d1 => d1.solicitado > 0);
        });


        this.swalService.show('¿Desea Enviar la Solicitud?', '').then((resp) => {
            if (!resp.dismiss) { }
        });


        // if (!existsDifference) {
        //     this.saveOrUpdate(this.solicitudRemesaService, this.solicitudRemesa, 'El Pase a Bóveda', this.isNew);
        // } else {

        //     this.swalService.show('Sobrepasó una de las Cantidades Disponibles en el Desglose', 'Resuelva el Problema y Vuelva a Procesar', { showCancelButton: false }).then((resp) => {
        //         if (!resp.dismiss) { }
        //     });

        // }
    }

}

