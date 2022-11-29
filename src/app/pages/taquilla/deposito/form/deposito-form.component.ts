import { formatNumber } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoDocumento } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaOperacion } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { Deposito, DepositoService } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
@Component({
    selector: 'app-deposito-form',
    templateUrl: './deposito-form.component.html',
    styleUrls: ['./deposito-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class DepositoFormComponent extends FormBaseComponent implements OnInit {
    public voucherForm: FormGroup;
    public itemForm: FormGroup;
    isNew: boolean = false;
    esEfectivo: boolean = true;
    esCheques: boolean = false;
    esMixto: boolean = false;
    // selected = 0;
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    deposito: Deposito = {} as Deposito;
    persona: Persona = {} as Persona;
    moneda: Moneda = {} as Moneda;
    loading = new BehaviorSubject<boolean>(false);

    constructor(
        injector: Injector,
        private router: Router,
        private depositoService: DepositoService,
        private taquillaService: TaquillaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.taquillaService.isOpen().subscribe(isOpen => {
            if (!isOpen) {
                this.router.navigate(['/sirio/welcome']);
                this.swalService.show('message.closedBoxOfficeTitle', 'message.closedBoxOfficeMessage', { showCancelButton: false }).then((resp) => {
                    if (!resp.dismiss) { }
                });
            } else {
                this.isNew = true;
            }
        });
    }

    depositoEfectivo(itemForm: FormGroup) {
        this.itemForm = itemForm;
    }

    depositoCheques(itemForm: FormGroup) {
        this.itemForm = itemForm;
    }

    depositoMixto(itemForm: FormGroup) {
        this.itemForm = itemForm;
    }

    voucher(voucherForm: FormGroup) {
        this.voucherForm = voucherForm;
    }

    queryResult(data: any) {
        // this.selected = 0;
        this.esEfectivo = true;
        if (data) {
            if (!data.id && !data.numper) {
                this.loaded$.next(false);
                this.persona = {} as Persona;
                this.cuentaOperacion = undefined;
                this.loading.next(false);
                this.cdr.detectChanges();
            } else {
                if (data.moneda) {
                    this.cuentaOperacion = data;
                    this.persona.nombre = this.cuentaOperacion.nombre;
                    this.persona.numper = this.cuentaOperacion.numper;
                    this.persona.identificacion = this.cuentaOperacion.identificacion;
                    this.persona.tipoDocumento = this.cuentaOperacion.tipoDocumento;
                    this.persona.email = this.cuentaOperacion.email;
                    this.loading.next(true);
                } else {
                    this.persona = data;
                    this.loading.next(true);
                }
            }
        }
    }

    // reset() {
    // this.selected = 0;
    // }

    resetVoucher() {
        this.voucherForm.controls['identificacionDepositante'].setValue('');
        this.voucherForm.controls['nombreDepositante'].setValue('');
        this.voucherForm.controls['email'].setValue('');
        this.voucherForm.controls['identificacionDepositante'].setErrors(undefined);
        this.voucherForm.controls['nombreDepositante'].setErrors(undefined);
        this.voucherForm.controls['email'].setErrors(undefined);
    }

    esEfectivoEvent(event) {
        if (event.checked) {
            this.esCheques = false;
            this.esMixto = false;
            this.resetVoucher();
        }
    }

    esChequesEvent(event) {
        if (event.checked) {
            this.esEfectivo = false;
            this.esMixto = false;
            this.resetVoucher();
        }
    }

    esMixtoEvent(event) {
        if (event.checked) {
            this.esEfectivo = false;
            this.esCheques = false;
            this.resetVoucher();
        }
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.deposito);
        let montoFormat = formatNumber(this.deposito.monto, 'es', '1.2');
        this.swalService.show('¿Desea Realizar el Depósito?', undefined,
            { 'html': 'Titular: <b>' + this.persona.nombre + '</b> <br/> ' + ' Por el Monto Total de: <b>' + montoFormat + ' ' + this.deposito.moneda?.siglas + '</b>' }

        ).then((resp) => {
            if (!resp.dismiss) {
                this.deposito.identificacion = this.persona.identificacion;
                this.deposito.tipoDocumento = this.persona.tipoDocumento;
                this.deposito.persona = this.persona.id;
                this.deposito.nombre = this.persona.nombre;
                this.deposito.numper = this.persona.numper;
                this.deposito.tipoDocumento = this.persona.tipoDocumento;
                this.deposito.identificacion = this.persona.identificacion;
                // this.deposito.operacion = (this.selected == 0) ? 'efectivo' : (this.selected == 1 ? 'cheques' : 'mixto');
                this.deposito.operacion = (this.esEfectivo) ? 'efectivo' : (this.esCheques ? 'cheques' : 'mixto');
                this.deposito.moneda = this.deposito.moneda.id;
                this.deposito.detalles = this.f.conoActual ? this.f.conoActual.value.concat(this.f.conoAnterior ? this.f.conoAnterior.value : undefined) : [];
                this.deposito.cheques = this.itemForm.controls.detalleCheques ? this.itemForm.controls.detalleCheques.value : [];
                this.deposito.cantidadPropio = this.itemForm.controls.cantidadPropio ? this.itemForm.controls.cantidadPropio.value : 0;
                this.deposito.cantidadOtros = this.itemForm.controls.cantidadOtros ? this.itemForm.controls.cantidadOtros.value : 0;
                this.updateDataFromValues(this.deposito, this.cuentaOperacion);
                this.updateDataFromValues(this.deposito, this.voucherForm.value);
                this.saveOrUpdate(this.depositoService, this.deposito, 'El Depósito', false);
                this.loadingDataForm.subscribe(status => {
                    if (!status) {
                        this.router.navigate(['/sirio/welcome']).then(data => { });
                    }
                })
            }
        })
    }
}



