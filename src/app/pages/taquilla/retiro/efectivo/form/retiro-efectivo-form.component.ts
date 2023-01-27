import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { ConoMonetario } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoTaquillaService } from 'src/@sirio/domain/services/control-efectivo/saldo-taquilla.service';
import { CuentaBancaria, CuentaBancariaOperacion, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { Retiro, RetiroService } from 'src/@sirio/domain/services/taquilla/retiro.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';



@Component({
    selector: 'app-retiro-efectivo-form',
    templateUrl: './retiro-efectivo-form.component.html',
    styleUrls: ['./retiro-efectivo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class RetiroEfectivoFormComponent extends FormBaseComponent implements OnInit {

    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);
    public conoActual: ConoMonetario[] = [];
    public conoAnterior: ConoMonetario[] = [];
    retiro: Retiro = {} as Retiro;
    persona: Persona = {} as Persona;
    cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    isNew: boolean = false;
    loading = new BehaviorSubject<boolean>(false);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private retiroService: RetiroService,
        private cuentaBancariaService: CuentaBancariaService,
        private taquillaService: TaquillaService,
        private saldoTaquillaService: SaldoTaquillaService,
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
                this.buildForm();
                this.loadingDataForm.next(false);
                this.f.monto.valueChanges.subscribe(val => {
                    if (val) {
                        this.calculateDifferences();
                        this.cdr.detectChanges();
                    } else if (val === null || val === '') {
                        this.f.monto.setValue(0.00);
                        this.cdr.detectChanges();
                    }
                });

                this.cdr.detectChanges();
            }
        });
    }

    buildForm() {

        this.itemForm = this.fb.group({
            tipoDocumento: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            identificacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            numper: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            monto: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            numeroCuenta: new FormControl(undefined),
            moneda: new FormControl(undefined),
            tipoProducto: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            totalRetiro: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            email: new FormControl(undefined, [Validators.required]),
            cuentaBancaria: new FormControl(undefined),
            conoActual: new FormControl([]),
            conoAnterior: new FormControl([]),
        });

        this.f.cuentaBancaria.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                let cuenta = this.cuentasBancarias.value.length > 0 ? this.cuentasBancarias.value.filter(e => e.id == val)[0] : this.cuentaOperacion;
                this.f.moneda.setValue({
                    id: cuenta.moneda,
                    nombre: cuenta.monedaNombre,
                    siglas: cuenta.siglas
                });
                // Se llama a la funcion para verificar si hay saldo en taquilla para la moneda 
                this.saldoByMoneda(this.f.moneda.value);
                this.f.numeroCuenta.setValue(cuenta.numeroCuenta);
                this.f.tipoProducto.setValue(cuenta.tipoProducto);
            }
        });

    }

    queryResult(data: any) {
        this.itemForm ? this.itemForm.reset({}) : '';
        this.f.totalRetiro.setValue(0.00);
        if (!data.id && !data.numper) {
            this.loaded$.next(false);
            this.cdr.detectChanges();
        } else {
            this.loaded$.next(true);
            if (data.moneda) {
                this.cuentaOperacion = data;
                this.f.moneda.setValue({
                    id: this.cuentaOperacion.moneda,
                    nombre: this.cuentaOperacion.monedaNombre,
                    siglas: this.cuentaOperacion.siglas
                });

                // Se llama a la funcion para verificar si hay saldo en taquilla para la moneda  
                this.saldoByMoneda(this.f.moneda.value);
                this.f.numeroCuenta.setValue(this.cuentaOperacion.numeroCuenta);
                this.f.tipoDocumento.setValue(this.cuentaOperacion.tipoDocumento);
                this.f.identificacion.setValue(this.cuentaOperacion.identificacion);
                this.f.cuentaBancaria.setValue(this.cuentaOperacion.id);
                this.persona.nombre = this.cuentaOperacion.nombre;
                if (this.cuentaOperacion.email) {
                    this.f.email.setValue(this.cuentaOperacion.email);
                    this.f.email.disable();
                }
                else {
                    this.f.email.enable();
                    this.f.email.value;
                }

            } else {
                this.loaded$.next(true);
                this.persona = data;
                this.cuentaOperacion = undefined;
                this.f.identificacion.setValue(this.persona.identificacion)
                this.f.tipoDocumento.setValue(this.persona.tipoDocumento);

                if (this.persona.email) {
                    this.f.email.setValue(this.persona.email);
                    this.f.email.disable();
                }
                else {
                    this.f.email.enable();
                    this.f.email.value;
                }
                //lista de las cuentas bancarias de la persona
                this.cuentaBancariaService.activesByPersona(this.persona.id).subscribe(data => {
                    this.cuentasBancarias.next(data);
                    if (data.length === 1) {
                        this.f.cuentaBancaria.setValue(data[0].id);
                    }
                })

            }
        }
    }


    calculateDifferences(event?: any) {

        let valorEfectivo = this.f.monto.value ? this.f.monto.value : 0.00;
        let montoRetiro = this.f.totalRetiro.value ? this.f.totalRetiro.value : 0.00;
        // La diferencia entre el efectivo y el total depositado no puede ser mayor a 1 ni menor a -1
        // Esto es porque pueden existir depositos con centavos y no hay cambio para centavos  
        let valor = (Math.abs(valorEfectivo - (event ? (event.montoTotal > 0 ? event.montoTotal : montoRetiro) : montoRetiro)) >= 1);
        if (valor || (event?.montoTotal===0)) {

            this.f.monto.setErrors({
                difference: true
            });
            
            if (event && (event.montoTotal > 0)) {
                
                this.f.totalRetiro.setValue(event.montoTotal);
                this.f.totalRetiro.setErrors({
                    totalDifference: true
                });
    
                this.f.totalRetiro.markAsDirty();
                this.cdr.detectChanges();
            }

            this.f.totalRetiro.markAsDirty();
            this.f.monto.markAsDirty();
            this.cdr.detectChanges()

        } else {
            if (event) {

                this.f.totalRetiro.setValue(this.f.monto.value);
                // this.f.totalRetiro.setValue(event.montoTotal);
                this.f.totalRetiro.setErrors(undefined);
                this.f.monto.setErrors(undefined);
            }else{
                this.f.monto.setErrors({
                    difference: true
                });
                this.f.monto.markAsDirty();
            }
        }
    }

    updateCashDetail(event) {
        if (!event) {
            return;
        }
        this.f.totalRetiro.setValue(event.montoTotal);
        this.calculateDifferences(event)
        this.f.conoActual.setValue(event.desgloseConoActual);
        this.f.conoAnterior.setValue(event.desgloseConoAnterior);
        this.cdr.detectChanges();
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.retiro);

        let montoFormat = formatNumber(this.retiro.monto, 'es', '1.2');
        this.swalService.show('¿Desea Realizar el Retiro?', undefined,
            { 'html': 'Titular: <b>' + (this.persona.nombre ? this.persona.nombre : this.cuentaOperacion.nombre) + '</b> <br/> ' + ' Por el Monto Total de: <b>' + montoFormat + ' ' + this.f.moneda.value.siglas + '</b>' }
        ).then((resp) => {
            if (!resp.dismiss) {

                if (this.persona) {
                    this.updateDataFromValues(this.retiro, this.persona);
                    this.retiro.persona = this.persona.id;
                    this.retiro.numper = this.persona.numper;
                    this.retiro.tipoDocumento = this.persona.tipoDocumento;
                    this.retiro.identificacion = this.persona.identificacion;
                    this.retiro.nombre = this.persona.nombre;
                    this.retiro.email = (this.retiro.email != undefined && this.retiro.email != '') ? this.retiro.email : this.f.email.value;
                }

                if (this.cuentaOperacion) {
                    this.updateDataFromValues(this.retiro, this.cuentaOperacion);
                    this.retiro.cuentaBancaria = this.cuentaOperacion.id;
                    this.retiro.email = (this.retiro.email != undefined && this.retiro.email != '') ? this.retiro.email : this.f.email.value;
                }

                this.retiro.detalles = this.f.conoActual.value.concat(this.f.conoAnterior.value);
                this.retiro.moneda = this.f.moneda.value.id;
                this.retiro.operacion = 'efectivo';
                this.saveOrUpdate(this.retiroService, this.retiro, 'el retiro en efectivo', false);
                this.loadingDataForm.subscribe(status => {
                    if (!status) {
                        this.router.navigate(['/sirio/welcome']).then(data => { });
                    }
                })
            }

        })


    }

    saldoByMoneda(moneda: Moneda) {
        this.saldoTaquillaService.getSaldoByMoneda(moneda.id).subscribe(saldo => {
            if (saldo == 0) {

                let mensaje = 'Para la Moneda <b>' + moneda.nombre + '</b> <br> No Existe Disponibilidad en su Caja'
                this.swalService.show('No Hay Disponibilidad De Efectivo', undefined, { html: mensaje, showCancelButton: false }).then((resp) => {
                    if (!resp.dismiss) {
                        this.router.navigate(['/sirio/welcome']);
                    }
                });

            }
        })


    }

    reset() {
        this.limpiar();
        if (this.persona.email) {
            this.f.email.setValue(this.persona.email);

        } else {
            this.limpiar();
            this.f.email.setValue('');
            this.cdr.detectChanges();
        }


        if (this.cuentaOperacion.email) {
            //    this.limpiar();
            this.f.email.setValue(this.cuentaOperacion.email);
        } else {
            this.limpiar();
            this.f.email.setValue('');
            this.cdr.detectChanges();
        }
        this.cdr.detectChanges();
    }


    limpiar() {
        // this.f.monto.reset();
        // this.f.totalRetiro.reset();
        this.f.totalRetiro.setValue(0.00);
        // this.f.totalRetiro.setErrors({
        //     required: true,
        // })
        this.f.monto.setValue(0.00);
        // this.f.monto.setErrors({
        //     required: true,
        // });

    }

}
