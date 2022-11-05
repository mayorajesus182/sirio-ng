import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { SaldoTaquilla, SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { Direccion } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import { formatNumber } from '@angular/common';

@Component({
    selector: 'app-cierre-taquilla-form',
    templateUrl: './cierre-taquilla-form.component.html',
    styleUrls: ['./cierre-taquilla-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CierreTaquillaFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    saldos = new BehaviorSubject<SaldoTaquilla[]>([]);
    preferencias: Preferencia = {} as Preferencia;
    diferencia: number = 0

    public direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router,
        private saldoTaquillaService: SaldoTaquillaService,
        private preferenciaService: PreferenciaService,
        private cdr: ChangeDetectorRef) {
        super(dialog, injector);
    }

    ngAfterViewInit(): void {
    }

    loadSaldos() {
        this.saldoTaquillaService.allWithMovements().subscribe(data => {
            this.saldos.next(data);
        });
    }

    ngOnInit() {
        this.isNew = false;

        this.preferenciaService.get().subscribe(data => {
            this.preferencias = data;
        });

        this.loadingDataForm.next(false);
        this.loadSaldos();
    }

    updateValuesErrors(saldo: SaldoTaquilla) {
        saldo.declarado = saldo.detalleEfectivo.filter(c => c.declarado != undefined && c.declarado > 0).map(c1 => c1.declarado * c1.denominacion).reduce((a, b) => a + b);
    }

    declare(saldoSave: SaldoTaquilla) {

        let declaradoFormat = formatNumber(saldoSave.declarado, 'es', '1.2');
        let ajusteDiferenciaFormat = formatNumber(Math.abs(saldoSave.declarado - saldoSave.saldo), 'es', '1.2');
        let tipo = undefined;

        if (Math.abs(saldoSave.declarado - saldoSave.saldo) > this.preferencias.ajusteTaquilla) {
            tipo = 'Se Generará Una Diferencia De: '.concat(ajusteDiferenciaFormat);
        } else if (Math.abs(saldoSave.declarado - saldoSave.saldo) > 0 && Math.abs(saldoSave.declarado - saldoSave.saldo) < this.preferencias.ajusteTaquilla) {
            tipo = 'Se Generará Un Ajuste De: '.concat(ajusteDiferenciaFormat);
        } else if (Math.abs(saldoSave.declarado - saldoSave.saldo) == 0) {
            tipo = 'No Existen Diferencias Ni Ajustes'
        }

        this.swalService.show('Monto Declarado ' + declaradoFormat, tipo).then((resp) => {
            if (!resp.dismiss) {
                this.saveOrUpdate(this.saldoTaquillaService, saldoSave, 'La declaración de cierre', this.isNew);
            }
        })
    }

    send() {
        this.loadSaldos();

        this.saldos.value.forEach(saldo => {
            console.log('saldo ', saldo);

        });

        console.log(this.saldos);
    }
}
