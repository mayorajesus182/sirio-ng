import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { BovedaAgencia, BovedaAgenciaService } from 'src/@sirio/domain/services/control-efectivo/boveda-agencia.service';
import { MovimientoEfectivo, MovimientoEfectivoService } from 'src/@sirio/domain/services/control-efectivo/movimiento-efectivo.service';
import { Taquilla, TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-pase-efectivo-form',
    templateUrl: './pase-efectivo-form.component.html',
    styleUrls: ['./pase-efectivo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaseEfectivoFormComponent extends FormBaseComponent implements OnInit {

    bovedaAgencia: BovedaAgencia = {} as BovedaAgencia;
    public movimientos = new BehaviorSubject<MovimientoEfectivo[]>([]);
    public taquillas = new BehaviorSubject<Taquilla[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private bovedaAgenciaService: BovedaAgenciaService,
        private movimientoEfectivoService: MovimientoEfectivoService,
        private monedaService: MonedaService,
        private taquillaService: TaquillaService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.bovedaAgenciaService.get(id).subscribe((agn: BovedaAgencia) => {
                this.bovedaAgencia = agn;
                this.buildForm(this.bovedaAgencia);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.bovedaAgencia);
            this.loadingDataForm.next(false);
        }

        this.movimientoEfectivoService.all().subscribe(data => {
            this.movimientos.next(data);
        });

        this.taquillaService.activesWithUser().subscribe(data => {
            this.taquillas.next(data);
        });

        this.monedaService.actives().subscribe(data => {
            this.monedas.next(data);
        });
    }

    buildForm(bovedaAgencia: BovedaAgencia) {
        this.itemForm = this.fb.group({
            taquilla: new FormControl({value: bovedaAgencia.taquilla || undefined, disabled: !this.isNew}, Validators.required),
            movimientoEfectivo: new FormControl(bovedaAgencia.movimientoEfectivo || undefined, Validators.required),
            moneda: new FormControl(bovedaAgencia.moneda || undefined, Validators.required),
            monto: new FormControl(bovedaAgencia.monto || undefined, Validators.required),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.bovedaAgencia);
        this.saveOrUpdate(this.bovedaAgenciaService, this.bovedaAgencia, 'El Pase de Efectivo', this.isNew);
    }

}
