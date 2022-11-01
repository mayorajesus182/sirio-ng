import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { SaldoTaquilla, SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { Direccion } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-cierre-taquilla-form',
    templateUrl: './cierre-taquilla-form.component.html',
    styleUrls: ['./cierre-taquilla-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CierreTaquillaFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    saldos = new BehaviorSubject<SaldoTaquilla[]>([]);
    diferencia: number = 0

    public direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router,
        private saldoTaquillaService: SaldoTaquillaService,
        private cdr: ChangeDetectorRef) {
        super(dialog, injector);
    }

    ngAfterViewInit(): void {
    }

    ngOnInit() {
        this.loadingDataForm.next(false);

        this.saldoTaquillaService.all().subscribe(data => {
            this.saldos.next(data);
        });
    }

    updateValuesErrors(saldoUpdate: SaldoTaquilla) {
        saldoUpdate.diferencia = saldoUpdate.detalleEfectivo.filter(c => c.cantidad != undefined && c.cantidad > 0).map(c1 => c1.cantidad * c1.denominacion).reduce((a, b) => a + b);
    }

    save(saldoSave: SaldoTaquilla) {
        saldoSave.diferencia -= saldoSave.saldo;
        console.log('this.saldos   ', saldoSave);
    }


}
