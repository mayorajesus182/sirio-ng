import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants/global.constants';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoDocumento } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaOperacion } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { Deposito, DepositoService } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
@Component({
    selector: 'app-tarjeta-debito-form',
    templateUrl: './tarjeta-debito-form.component.html',
    styleUrls: ['./tarjeta-debito-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class TarjetaDebitoFormComponent extends FormBaseComponent implements OnInit {
    constants = GlobalConstants;
    itemForm: FormGroup;
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    // isNew: boolean = false;
    // cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    deposito: Deposito = {} as Deposito;
    persona: Persona = {} as Persona;
    moneda: Moneda = {} as Moneda;
    loading = new BehaviorSubject<boolean>(false);

    constructor(
        injector: Injector,
        private depositoService: DepositoService,
        private taquillaService: TaquillaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.taquillaService.isOpen().subscribe(isOpen => {
            // if (!isOpen) {
            //     this.router.navigate(['/sirio/welcome']);
            //     this.swalService.show('message.closedBoxOfficeTitle', 'message.closedBoxOfficeMessage', { showCancelButton: false }).then((resp) => {
            //         if (!resp.dismiss) { }
            //     });
            // } else {
            // this.isNew = true;
            // }
        });
    }

    entrega(itemForm: FormGroup) {
        this.itemForm = itemForm;
    }

    queryResult(event: any) {
        this.itemForm?this.itemForm.reset({}):'';
        this.loading.next(false);
        if (!event.id) {
            this.loading.next(false);
            this.persona = {} as Persona;
            this.cdr.detectChanges();
        } else {
            this.loading.next(true);
            this.persona = event;
            this.cdr.detectChanges()
            // console.log("pruebaaa", this.persona);
        }
    }


    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.deposito);
        this.swalService.show('Sirio', undefined,
            { 'html': 'La entrega de TDD' + '<b>(Tipo de Tarjeta)</b>' + '' + ' Nro.' + '<b>Numero de Tarjeta</b>' + ' ' + 'para' + '<b>Número de Cuenta</b>' + ' ' + ', CI ' + ' <b> Identificacion </b>' + ' Se ha gestionado Exitosamente.' }

        ).then((resp) => {
            if (!resp.dismiss) {
                // this.deposito.identificacion = this.persona.identificacion;
                // this.deposito.tipoDocumento = this.persona.tipoDocumento;
                // this.deposito.persona = this.persona.id;
                // this.deposito.nombre = this.persona.nombre;
                // this.deposito.numper = this.persona.numper;
                // this.deposito.tipoDocumento = this.persona.tipoDocumento;
                // this.deposito.identificacion = this.persona.identificacion;
                // this.deposito.operacion = (this.esEfectivo) ? 'efectivo' : (this.esCheques ? 'cheques' : 'mixto');
                // this.deposito.moneda = this.deposito.moneda.id;
                this.updateDataFromValues(this.deposito, this.persona);
                this.saveOrUpdate(this.depositoService, this.deposito, 'La Tarjeta de Débito', false);
                this.loadingDataForm.subscribe(status => {
                    if (!status) {
                        this.router.navigate(['/sirio/welcome']).then(data => { });
                    }
                })
            }
        })
    }
}



