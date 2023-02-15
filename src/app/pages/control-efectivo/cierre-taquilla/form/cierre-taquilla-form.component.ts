import { formatNumber } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { SaldoTaquilla, SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
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
    preferencias: Preferencia;
    diferencia: number = 0
    isOpen: boolean = false;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private saldoTaquillaService: SaldoTaquillaService,
        private preferenciaService: PreferenciaService,
        private taquillaService: TaquillaService,
        private workflowService: WorkflowService,
        private cdr: ChangeDetectorRef) {
        super(dialog, injector);
    }

    ngAfterViewInit(): void {
    }

    loadSaldos() {
        this.saldoTaquillaService.allOpen().subscribe(data => {
            this.saldos.next(data);

            console.log(data);

        });

        // this.saldoTaquillaService.allWithMovements().subscribe(data => {
        //     this.saldos.next(data);
        // });
    }

    ngOnInit() {

        this.taquillaService.isOpen().subscribe(isOpen => {

            this.isNew = false;
            this.isOpen = isOpen;

            this.preferenciaService.active().subscribe(data => {
                this.preferencias = data;
            });

            this.loadingDataForm.next(false);
            this.loadSaldos();
        });
    }

    updateValuesErrors(saldo: SaldoTaquilla) {
        saldo.declarado = 0.0;
        saldo.declarado = saldo.detalleEfectivo.filter(c => c.declarado != undefined && c.declarado > 0).map(c1 => c1.declarado * c1.denominacion).reduce((a, b) => a + b);
    }

    // TODO: FALTAN  ETIQUETAS

    calculateDifferences(saldoTaquilla: SaldoTaquilla) {

        let mensaje = '';

        if (saldoTaquilla.moneda === this.preferencias.monedaConoActual.value) {

            if (Math.abs(saldoTaquilla.declarado - saldoTaquilla.saldo) > Number.parseFloat(this.preferencias.ajusteSobrante.value)) {

                let ajuste = saldoTaquilla.declarado > saldoTaquilla.saldo ? (Number.parseFloat(this.preferencias.ajusteSobrante.value) * -1) : Number.parseFloat(this.preferencias.ajusteSobrante.value);
                // let ajusteTaquillaFormat = formatNumber(ajuste, 'es', '1.2');
                // let diferenciaGeneradaFormat = formatNumber(saldoTaquilla.saldo - saldoTaquilla.declarado - ajuste, 'es', '1.2');
                let diferenciaGeneradaFormat = formatNumber(saldoTaquilla.saldo - saldoTaquilla.declarado, 'es', '1.2');
                // mensaje = (saldoTaquilla.declarado > saldoTaquilla.saldo ? 'Se Generará Un Ajuste Sobrante De: ' : 'Se Generará Un Ajuste Faltante De: ').concat(ajusteTaquillaFormat).concat(' <br/> ');
                mensaje = mensaje + (saldoTaquilla.declarado > saldoTaquilla.saldo ? 'Y Una Diferencia Sobrante De: ' : 'Y Una Diferencia Faltante De: ').concat(diferenciaGeneradaFormat);
                // saldoTaquilla.ajuste = ajuste;
                // saldoTaquilla.diferencia = saldoTaquilla.saldo - saldoTaquilla.declarado - ajuste;
                saldoTaquilla.ajuste = 0;
                saldoTaquilla.diferencia = saldoTaquilla.saldo - saldoTaquilla.declarado;

            } else if (Math.abs(saldoTaquilla.declarado - saldoTaquilla.saldo) > 0 && Math.abs(saldoTaquilla.declarado - saldoTaquilla.saldo) <= Number.parseFloat(this.preferencias.ajusteSobrante.value)) {

                let ajusteGeneradoFormat = formatNumber(saldoTaquilla.saldo - saldoTaquilla.declarado, 'es', '1.2');
                mensaje = (saldoTaquilla.declarado > saldoTaquilla.saldo ? 'Se Generará Un Ajuste Sobrante De: ' : 'Se Generará Un Ajuste Faltante De: ').concat(ajusteGeneradoFormat);
                saldoTaquilla.ajuste = saldoTaquilla.saldo - saldoTaquilla.declarado;
                saldoTaquilla.diferencia = 0;

            } else if (Math.abs(saldoTaquilla.declarado - saldoTaquilla.saldo) == 0) {
                mensaje = 'No Existen Diferencias Ni Ajustes'
                saldoTaquilla.ajuste = 0;
                saldoTaquilla.diferencia = 0;
            }

        } else {

            if (saldoTaquilla.saldo != saldoTaquilla.declarado) {
                let diferenciaGeneradaFormat = formatNumber(saldoTaquilla.saldo - saldoTaquilla.declarado, 'es', '1.2');
                mensaje = (saldoTaquilla.declarado > saldoTaquilla.saldo ? 'Y Una Diferencia Sobrante De: ' : 'Y Una Diferencia Faltante De: ').concat(diferenciaGeneradaFormat);
                saldoTaquilla.diferencia = saldoTaquilla.saldo - saldoTaquilla.declarado;
                saldoTaquilla.ajuste = 0;
            } else {
                mensaje = 'No Existen Diferencias'
                saldoTaquilla.ajuste = 0;
                saldoTaquilla.diferencia = 0;
            }
        }
        return mensaje;
    }

    declare(saldoSave: SaldoTaquilla) {

        let declaradoFormat = formatNumber(saldoSave.declarado, 'es', '1.2');

        this.swalService.show('Monto Declarado ' + declaradoFormat, undefined, { 'html': this.calculateDifferences(saldoSave) }).then((resp) => {
            if (!resp.dismiss) {

                this.saldoTaquillaService.update(saldoSave).subscribe(data => {
                    // this.itemForm.reset({});
                    this.successResponse('La declaración de cierre', 'Procesada', true);
                    saldoSave.confirmado = 1;
                    return data;
                }, error => this.errorResponse(true));

                // this.saveOrUpdate(this.saldoTaquillaService, saldoSave, 'La declaración de cierre', this.isNew);
            } else {
                this.loadSaldos();
            }
        })
    }

    closeDay() {

        this.workflowService.existsAnyOpen().subscribe(isOpen => {

            let mensaje = '';

            if (isOpen) {

                mensaje = 'Cierre Sus Tareas Pendientes Y Verifique Que No Existan Pases En Transito Pendientes Por Aprobación De La Bóveda';
                this.swalService.show('No Puede Cerrar La Taquilla', undefined, { html: mensaje, showCancelButton: false }).then((resp) => {
                    if (!resp.dismiss) { }
                });


            } else {

                let taquilla;
                let porDeclarar = '';

                this.saldos.value.forEach(saldo => {
                    taquilla = saldo.taquilla;

                    // console.log('saldo.diferencia  ', saldo.diferencia);
                    // console.log('saldo.ajuste  ', saldo);
                    // console.log('(saldo.saldo > 0 || saldo.ajuste != 0 || saldo.diferencia != 0)  ', (saldo.saldo > 0 || saldo.ajuste != 0 || saldo.diferencia != 0));
                    // console.log('(saldo.confirmado == 0)  ', (saldo.confirmado == 0));
                    // console.log('fin  ', ((saldo.saldo > 0 || saldo.ajuste != 0 || saldo.diferencia != 0) && (saldo.confirmado == 0)));
                    // console.log('saldo.ajuste  ', saldo);

                    // Si la declaración del saldo no esta confirmada y existe algun saldo, ajuste o diferencia, no se puede cerrar
                    if ((saldo.saldo > 0 || saldo.ajuste != 0 || saldo.diferencia != 0) && (saldo.confirmado == 0)) {
                        porDeclarar = porDeclarar + saldo.siglasMoneda.concat(' - ').concat(saldo.nombreMoneda).concat(' <br/> ');
                    }

                    mensaje = mensaje + '<b> '.concat(saldo.siglasMoneda).concat(' - ').concat(saldo.nombreMoneda).concat(' </b> <br/> ').concat(this.calculateDifferences(saldo)).concat(' <br/>  ');
                });

                if (porDeclarar != '') {
                    this.swalService.show('Antes de Cerrar la Jornada debe Declarar su Saldo en:', undefined, { html: porDeclarar, showCancelButton: false }).then((resp) => {
                        if (!resp.dismiss) { }
                    });
                } else {
                    this.swalService.show('¿Desea Cerrar La Jornada?', undefined, { html: mensaje }).then((resp) => {
                        if (!resp.dismiss) {
                            this.taquillaService.close(taquilla).subscribe(result => {
                                this.snack.show({ message: 'Taquilla Cerrada Exitosamente Para La Jornada!', verticalPosition: 'bottom' });
                                this.router.navigate(['/sirio/welcome']);
                            });
                        }
                    });
                }
            }
        });
    }
}
