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
import { pago_proveedores, pago_proveedoresService } from 'src/@sirio/domain/services/servicio/pago-proveedores.service';

@Component({
    selector: 'app-pago-proveedores-form',
    templateUrl: './pago-proveedores.component.html',
    styleUrls: ['./pago-proveedores.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
    
})

export class DepositoFormComponent extends FormBaseComponent implements OnInit {
    
    fromOtherComponent: boolean=false;
    constants = GlobalConstants;
    public voucherForm: FormGroup;
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    isNew: boolean = false;
    pago_proveedores: pago_proveedores = {} as pago_proveedores;
    cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    persona: Persona = {} as Persona;
    moneda: Moneda = {} as Moneda;
    loading = new BehaviorSubject<boolean>(false);
    tipoDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
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
    
            if(data.get('doc') && data.get('tdoc')){
                this.fromOtherComponent=true
                this.isNew=true;
                this.persona.identificacion=data.get('doc');
                this.persona.tipoDocumento=data.get('tdoc');
                this.loaded$.next(true);
            }
        });

  
    }

    voucher(voucherForm: FormGroup) {
        this.voucherForm = voucherForm;
    }

    queryResult(data: any) {
        console.log("data",data)
        this.resetBusqueda();
        this.resetVoucher();
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
                    console.log(this.persona.email)
                    this.persona.email = this.cuentaOperacion.email;
                    this.loading.next(true);
                } else {
                    this.persona = data;
                    this.loading.next(true);
                }
            }
        }

    }


    resetBusqueda() {
        this.itemForm?this.itemForm.reset({}):'';
    }

    resetVoucher(){
        this.voucherForm?this.voucherForm.reset({}):'';
        this.voucherForm? this.voucherForm.controls.tipoDocumentoBeneficiario.setValue(GlobalConstants.PJ_TIPO_DOC_DEFAULT): '';
    }


    save() {
     
        this.pago_proveedores.afl_identificacion = this.persona.identificacion;
        this.pago_proveedores.afl_tipoDocumento = this.persona.tipoDocumento;
        this.pago_proveedores.id_cliente = this.persona.id;
        this.pago_proveedores.afl_nombre = this.persona.nombre;
        this.pago_proveedores.afl_numper = this.persona.numper;

        //         this.updateDataFromValues(this.deposito, this.cuentaOperacion);
        //         this.updateDataFromValues(this.deposito, this.voucherForm.value);
        //this.save();
        console.log(this.pago_proveedores)
        this.isNew = true;
         this.saveOrUpdate(this.Pago_proveedoresService, this.pago_proveedores,'afiliacion',this.isNew);
         //this.saveOrUpdate(this.perfilService, this.perfil, 'El perfil')
                this.loadingDataForm.subscribe(status => {
                    if (!status) {
                        this.router.navigate(['/sirio/welcome']).then(data => { });
                    }
                })
        //     }
        // })
    }
}



