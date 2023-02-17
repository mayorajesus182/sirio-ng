import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants/global.constants';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancaria, CuentaBancariaOperacion } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import { pago_proveedores, pago_proveedoresService, Tipo_Servicio } from 'src/@sirio/domain/services/servicio/pago-proveedores.service';
import { PersonaJuridica } from 'src/@sirio/domain/services/persona/persona-juridica.service';

@Component({
    selector: 'app-pago-proveedores-form',
    templateUrl: './pago-proveedores.component.html',
    styleUrls: ['./pago-proveedores.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],

})

export class DepositoFormComponent extends FormBaseComponent implements OnInit {

    fromOtherComponent: boolean = false;
    constants = GlobalConstants;
    public voucherForm: FormGroup;
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    isNew: boolean = false;
    public itemForm: FormGroup;
    pago_proveedores: pago_proveedores = {} as pago_proveedores;
    cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    persona: Persona = {} as Persona;
    moneda: Moneda = {} as Moneda;
    loading = new BehaviorSubject<boolean>(false);
    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    tipo_servicios = new BehaviorSubject<Tipo_Servicio[]>([]);
    personaJuridica: PersonaJuridica;
    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tipoDocumentoService: TipoDocumentoService,
        private Pago_proveedoresService: pago_proveedoresService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        GlobalConstants.TIPO_PERSONA = 'J';





        this.tipoDocumentoService.activesByTipoPersona(this.constants.PERSONA_JURIDICA).subscribe(data => {
            this.tipoDocumentos.next(data);
        });



        this.route.paramMap.subscribe(data => {

            if (data.get('doc') && data.get('tdoc')) {
                this.fromOtherComponent = true
                this.isNew = true;
                this.persona.identificacion = data.get('doc');
                this.persona.tipoDocumento = data.get('tdoc');
                this.loaded$.next(true);
            }
        });







    }


    CuentaProveedores(itemForm: FormGroup) {
        this.itemForm = itemForm;
    }

    voucher(voucherForm: FormGroup) {
        this.voucherForm = voucherForm;
    }



    queryResult(event) {
        console.log("data", event)
        this.resetBusqueda();
        this.resetVoucher();
        if (event) {
            if (!event.id && !event.numper) {
                console.log("data2", event)
                this.loaded$.next(false);
                this.personaJuridica = {} as PersonaJuridica;
                this.cuentaOperacion = undefined;
                this.loading.next(false);
                this.cdr.detectChanges();

            } else {
                if (event.moneda) {
                    console.log("data3", event)
                    this.cuentaOperacion = event;
                    this.persona.nombre = this.cuentaOperacion.nombre;
                    this.persona.numper = this.cuentaOperacion.numper;
                    this.persona.identificacion = this.cuentaOperacion.identificacion;
                    this.persona.tipoDocumento = this.cuentaOperacion.tipoDocumento;
                    console.log(this.persona.email)
                    this.persona.email = this.cuentaOperacion.email;
                    this.loading.next(true);
                } else {
                    console.log("data4", event)
                    this.personaJuridica = {} as PersonaJuridica;
                    this.isNew = true;
                    this.personaJuridica = event;
                    this.cuentaOperacion = event;
                    this.persona.nombre = this.cuentaOperacion.nombre;
                    this.persona.numper = this.cuentaOperacion.numper;
                    this.persona.identificacion = this.cuentaOperacion.identificacion;
                    this.persona.tipoDocumento = this.cuentaOperacion.tipoDocumento;
                    this.persona.email = this.cuentaOperacion.email;
                    this.persona.id = this.cuentaOperacion.id;
                    this.cuentaOperacion = undefined;
                    this.loading.next(true);
                    this.cdr.detectChanges();
                }
            }
        }

    }


    resetBusqueda() {
        this.itemForm ? this.itemForm.reset({}) : '';
    }

    resetVoucher() {
        this.voucherForm ? this.voucherForm.reset({}) : '';
        this.voucherForm ? this.voucherForm.controls.tipoDocumentoBeneficiario.setValue(GlobalConstants.PJ_TIPO_DOC_DEFAULT) : '';
    }


    save() {

        this.pago_proveedores.afl_identificacion = this.persona.identificacion;
        this.pago_proveedores.afl_tipoDocumento = this.persona.tipoDocumento;
        this.pago_proveedores.id_cliente = this.persona.id;
        this.pago_proveedores.afl_nombre = this.persona.nombre;
        this.pago_proveedores.afl_numper = this.persona.numper;
        this.pago_proveedores.afl_correo = this.itemForm.controls.email ? this.itemForm.controls.email.value : [];
        this.pago_proveedores.afl_tipo_servicio = this.itemForm.controls.TipoOperacion ? this.itemForm.controls.TipoOperacion.value : [];
        this.pago_proveedores.afl_cuenta = this.itemForm.controls.numeroCuenta ? this.itemForm.controls.numeroCuenta.value : [];
        console.log(this.pago_proveedores)
        this.isNew = true;
        this.saveOrUpdate(this.Pago_proveedoresService, this.pago_proveedores, 'afiliacion', this.isNew);
        this.loadingDataForm.subscribe(status => {
            if (!status) {
                this.router.navigate(['/sirio/welcome']).then(data => { });
            }
        })
        //     }
        // })
    }
}



