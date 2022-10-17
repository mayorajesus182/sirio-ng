import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { CajaTaquilla, CajaTaquillaService } from 'src/@sirio/domain/services/control-efectivo/caja-taquilla.service';
import { MovimientoEfectivo, MovimientoEfectivoService } from 'src/@sirio/domain/services/control-efectivo/movimiento-efectivo.service';
import { Taquilla, TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-pase-boveda-form',
    templateUrl: './pase-boveda-form.component.html',
    styleUrls: ['./pase-boveda-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PaseABovedaFormComponent extends FormBaseComponent implements OnInit {

    movimientoEfectivo: MovimientoEfectivo = {} as MovimientoEfectivo;
    taquilla: Taquilla = {} as Taquilla;
    cajaTaquilla: CajaTaquilla = {} as CajaTaquilla;
    public movimientos = new BehaviorSubject<MovimientoEfectivo[]>([]);
    public taquillas = new BehaviorSubject<Taquilla[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private cajaTaquillaService: CajaTaquillaService,
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
            this.cajaTaquillaService.get(id).subscribe((agn: CajaTaquilla) => {
                this.cajaTaquilla = agn;
                this.buildForm(this.cajaTaquilla);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.cajaTaquilla);
            this.loadingDataForm.next(false);
        }

        this.monedaService.actives().subscribe(data => {
            this.monedas.next(data);
        });

        this.movimientoEfectivoService.get(GlobalConstants.TAQUILLA_BOVEDA).subscribe(data => {
            this.movimientoEfectivo = data;
            this.cdr.detectChanges();
        });

        this.taquillaService.getByUsuario().subscribe(data => {
            this.taquilla = data;
            this.cdr.detectChanges();
        });
    }

    buildForm(cajaTaquilla: CajaTaquilla) {
        this.itemForm = this.fb.group({
            taquilla: new FormControl(''),
            movimientoEfectivo: new FormControl(''),
            moneda: new FormControl(cajaTaquilla.moneda || undefined, Validators.required),
            monto: new FormControl(cajaTaquilla.monto || undefined, Validators.required),
        });
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.cajaTaquilla);    
        this.cajaTaquilla.taquilla = this.taquilla.id;
        this.cajaTaquilla.movimientoEfectivo = this.movimientoEfectivo.id;

        console.log('  this.cajaTaquilla   ', this.cajaTaquilla);
        
        this.saveOrUpdate(this.cajaTaquillaService, this.cajaTaquilla, 'El Pase a Bóveda', this.isNew);
    }

}