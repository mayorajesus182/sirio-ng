import { formatNumber } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { SaldoAgencia, SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { SaldoTaquilla, SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-cierre-agencia-form',
    templateUrl: './cierre-agencia-form.component.html',
    styleUrls: ['./cierre-agencia-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CierreAgenciaFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    saldos = new BehaviorSubject<SaldoAgencia[]>([]);
    agencia: Agencia = {} as Agencia;
    diferencia: number = 0

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router,
        private saldoAgenciaService: SaldoAgenciaService,
        private agenciaService: AgenciaService,
        private cdr: ChangeDetectorRef) {
        super(dialog, injector);
    }

    ngAfterViewInit(): void {
    }

    // loadSaldos() {
    //     this.saldoAgenciaService.allWithMovements().subscribe(data => {
    //         this.saldos.next(data);

    //         console.log('data    ', data)
    //     });
    // }

    ngOnInit() {


        this.agenciaService.getWithUsuario().subscribe(data => {
            this.agencia = data;
        });

        this.saldoAgenciaService.allWithMovements().subscribe(data => {
            this.saldos.next(data);
        });


        // this.taquillaService.isOpen().subscribe(isOpen => {
        //     if (isOpen) {

        //         this.isNew = false;

        //         this.loadingDataForm.next(false);
        //         this.loadSaldos();

        //     } else {

        //       this.router.navigate(['/sirio/welcome']);
        //       this.swalService.show('message.closedBoxOfficeTitle', 'message.closedBoxOfficeMessage', { showCancelButton: false }).then((resp) => {
        //         if (!resp.dismiss) {}
        //       });
        //     }
        //   });
    }

    // updateValuesErrors(saldo: SaldoTaquilla) {
    //     saldo.declarado = saldo.detalleEfectivo.filter(c => c.declarado != undefined && c.declarado > 0).map(c1 => c1.declarado * c1.denominacion).reduce((a, b) => a + b);
    // }

    // TODO: FALTAN  ETIQUETAS

    // calculateDifferences(saldoTaquilla: SaldoTaquilla) {

    //     let mensaje = '';

    //     if (saldoTaquilla.moneda === this.preferencias.monedaConoActual) {

    //         if (Math.abs(saldoTaquilla.declarado - saldoTaquilla.saldo) > this.preferencias.ajusteTaquilla) {

    //             let ajuste = saldoTaquilla.declarado > saldoTaquilla.saldo ? (this.preferencias.ajusteTaquilla * -1) : this.preferencias.ajusteTaquilla;
    //             let ajusteTaquillaFormat = formatNumber(ajuste, 'es', '1.2');
    //             let diferenciaGeneradaFormat = formatNumber(saldoTaquilla.saldo - saldoTaquilla.declarado - ajuste, 'es', '1.2');
    //             mensaje = (saldoTaquilla.declarado > saldoTaquilla.saldo ? 'Se Generará Un Ajuste Sobrante De: ' : 'Se Generará Un Ajuste Faltante De: ').concat(ajusteTaquillaFormat).concat(' <br/> ');
    //             mensaje = mensaje + (saldoTaquilla.declarado > saldoTaquilla.saldo ? 'Y Una Diferencia Sobrante De: ' : 'Y Una Diferencia Faltante De: ').concat(diferenciaGeneradaFormat);
    //             saldoTaquilla.ajuste = ajuste;
    //             saldoTaquilla.diferencia = saldoTaquilla.saldo - saldoTaquilla.declarado - ajuste;

    //         } else if (Math.abs(saldoTaquilla.declarado - saldoTaquilla.saldo) > 0 && Math.abs(saldoTaquilla.declarado - saldoTaquilla.saldo) <= this.preferencias.ajusteTaquilla) {

    //             let ajusteGeneradoFormat = formatNumber(saldoTaquilla.saldo - saldoTaquilla.declarado, 'es', '1.2');
    //             mensaje = (saldoTaquilla.declarado > saldoTaquilla.saldo ? 'Se Generará Un Ajuste Sobrante De: ' : 'Se Generará Un Ajuste Faltante De: ').concat(ajusteGeneradoFormat);
    //             saldoTaquilla.ajuste = saldoTaquilla.saldo - saldoTaquilla.declarado;
    //             saldoTaquilla.diferencia = 0;

    //         } else if (Math.abs(saldoTaquilla.declarado - saldoTaquilla.saldo) == 0) {
    //             mensaje = 'No Existen Diferencias Ni Ajustes'
    //             saldoTaquilla.ajuste = 0;
    //             saldoTaquilla.diferencia = 0;
    //         }

    //     } else {

    //         if (saldoTaquilla.saldo != saldoTaquilla.declarado) {
    //             let diferenciaGeneradaFormat = formatNumber(saldoTaquilla.saldo - saldoTaquilla.declarado, 'es', '1.2');
    //             mensaje = (saldoTaquilla.declarado > saldoTaquilla.saldo ? 'Y Una Diferencia Sobrante De: ' : 'Y Una Diferencia Faltante De: ').concat(diferenciaGeneradaFormat);
    //             saldoTaquilla.diferencia = saldoTaquilla.saldo - saldoTaquilla.declarado;
    //             saldoTaquilla.ajuste = 0;
    //         } else {
    //             mensaje = 'No Existen Diferencias'
    //             saldoTaquilla.ajuste = 0;
    //             saldoTaquilla.diferencia = 0;
    //         }
    //     }
    //     return mensaje;
    // }

    // declare(saldoSave: SaldoTaquilla) {

    //     let declaradoFormat = formatNumber(saldoSave.declarado, 'es', '1.2');

    //     this.swalService.show('Monto Declarado ' + declaradoFormat, undefined, { 'html': this.calculateDifferences(saldoSave) }).then((resp) => {
    //         if (!resp.dismiss) {
    //             this.saveOrUpdate(this.saldoTaquillaService, saldoSave, 'La declaración de cierre', this.isNew);
    //         } else {
    //             this.loadSaldos();
    //         }
    //     })
    // }

    closeDay() {

        // let taquilla;
        let mensaje = '';


        this.agenciaService.close(this.agencia.id).subscribe(result => {
            this.snack.show({ message: 'Agencia Cerrada Exitosamente Para La Jornada!', verticalPosition: 'bottom' });
            this.router.navigate(['/sirio/welcome']);
        });


        // this.saldos.value.forEach(saldo => {
        //     taquilla = saldo.taquilla;
        //     mensaje = mensaje + '<b> '.concat(saldo.siglasMoneda).concat(' - ').concat(saldo.nombreMoneda).concat(' </b> <br/> ').concat(this.calculateDifferences(saldo)).concat(' <br/>  ');
        // });

        // this.swalService.show('¿Desea Cerrar La Jornada Para La Agencia?', undefined, { 'html': mensaje }).then((resp) => {
        //     if (!resp.dismiss) {
        //         this.taquillaService.close(saldo.agencia).subscribe(result => {
        //             this.snack.show({ message: 'Taquilla Cerrada Exitosamente Para La Jornada!', verticalPosition: 'bottom' });
        //             this.router.navigate(['/sirio/welcome']);
        //         });
        //     }
        // });
    }
}
