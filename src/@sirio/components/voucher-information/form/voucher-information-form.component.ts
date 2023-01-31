import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { CuentaBancariaOperacion } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
@Component({
    selector: 'sirio-voucher-information',
    templateUrl: './voucher-information-form.component.html',
    styleUrls: ['./voucher-information-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class VoucherInformationFormComponent implements OnInit, AfterViewInit {
    public voucherForm: FormGroup;
    @Input() persona: Persona = {} as Persona;
    @Input() cuentaOperacion: CuentaBancariaOperacion = {} as CuentaBancariaOperacion;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    public tiposDocumentoNaturales = new BehaviorSubject<TipoDocumento[]>([]);
    
    constructor(
        private fb: FormBuilder,
        private tipoDocumentoService: TipoDocumentoService,
        private cdref: ChangeDetectorRef) {
    }

    ngAfterViewInit(): void {
        this.cdref.detectChanges();
        this.voucherForm.valueChanges.subscribe(val => {
            if(val){
            this.result.emit(this.voucherForm)     
            }
        })
    }

    ngOnInit() {

        this.tipoDocumentoService.activesNaturales().subscribe(data => {
            this.tiposDocumentoNaturales.next(data);
        });

        this.voucherForm = this.fb.group({
            tipoDocumentoBeneficiario: new FormControl(GlobalConstants.PN_TIPO_DOC_DEFAULT, Validators.required),
            identificacionBeneficiario: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            nombreBeneficiario: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            telefono: new FormControl(''),
            email: new FormControl(''),
            // libreta: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
            // linea: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
            // conLibreta: new FormControl(false),
            // conMovimiento: new FormControl(false),
        });

        this.voucher.identificacionBeneficiario.valueChanges.subscribe(val => {
            if (val) {
                if (val === this.persona.identificacion) {
                    this.voucher.nombreBeneficiario.setValue(this.persona.nombre);
                    this.voucher.email.setValue(this.persona.email);
                    this.cdref.detectChanges();
                } else {
                    this.voucher.nombreBeneficiario.setValue('');
                    this.voucher.email.setValue('');
                    this.cdref.detectChanges();
                }
            }
        })
    }
    // this.voucher.conLibreta.valueChanges.subscribe(val => {
    //     if (!val) {
    //         voucher.libreta.setValue(undefined);
    //         voucher.libreta.setErrors(undefined);
    //         voucher.linea.setValue(undefined);
    //         voucher.linea.setErrors(undefined);
    //         cdr.detectChanges();
    //     }

    // });
    get voucher(): AbstractControl | any {
        return this.voucherForm ? this.voucherForm.controls : {};
    }
    // libretaEvaluate(event) {
    //     if (event.checked) {
    //         this.voucher.conMovimiento.setValue(false);
    //     }
    // }

    // movimientoEvaluate(event) {
    //     if (event.checked) {
    //         this.voucher.conLibreta.setValue(false);
    //     }
    // }

    resetAll() {
        // this.voucher.identificacionBeneficiario.setValue('');
        // this.voucher.nombreBeneficiario.setValue('');
        // this.voucher.email.setValue('');
        // this.voucher.identificacionBeneficiario.setErrors(undefined);
        // this.voucher.nombreBeneficiario.setErrors(undefined);
        // this.voucher.email.setErrors(undefined);
        this.voucherForm.reset({});
        this.voucher.tipoDocumentoBeneficiario.setValue(GlobalConstants.PN_TIPO_DOC_DEFAULT);
    }
}












