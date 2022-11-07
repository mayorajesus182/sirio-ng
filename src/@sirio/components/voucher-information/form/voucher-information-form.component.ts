import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { Deposito, DepositoService } from 'src/@sirio/domain/services/taquilla/deposito.service';
@Component({
    selector: 'sirio-voucher-information',
    templateUrl: './voucher-information-form.component.html',
    styleUrls: ['./voucher-information-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class VoucherInformationFormComponent implements OnInit, AfterViewInit {
    voucherForm: FormGroup;
    isNew: boolean = false;
    @Input() tooltips: string = 'Crear';
    @Input() taquillaDeposito: boolean = false;
    // conLibreta: boolean = false;
    // conMovimiento: boolean = false;
    @Input() disabled: boolean = false;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    // @Output('update') update: EventEmitter<any> = new EventEmitter<any>();
    // @Output('create') create: EventEmitter<any> = new EventEmitter<any>();

    public tiposDocumentoNaturales = new BehaviorSubject<TipoDocumento[]>([]);
    deposito: Deposito = {} as Deposito;
    persona: Persona = {} as Persona;
    tipoProducto: string = "";
    loading = new BehaviorSubject<boolean>(false);

    constructor(
        private fb: FormBuilder,
        private tipoDocumentoService: TipoDocumentoService,
        private depositoService: DepositoService,
        private cdref: ChangeDetectorRef) {
    }




    ngAfterViewInit(): void {
        this.cdref.detectChanges();
    }

    ngOnInit() {
        
        this.tipoDocumentoService.activesNaturales().subscribe(data => {
            this.tiposDocumentoNaturales.next(data);
        });

        this.voucherForm = this.fb.group({
            tipoDocumentoDepositante: new FormControl('', Validators.required),
            identificacionDepositante: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            nombreDepositante: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            telefono: new FormControl(''),
            email: new FormControl(''),
            libreta: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
            linea: new FormControl('', Validators.pattern(RegularExpConstants.NUMERIC)),
            conLibreta: new FormControl(false), 
            conMovimiento: new FormControl(false),
        });


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
    
    libretaEvaluate(event) {
        if (event.checked) {
            this.voucher.conMovimiento.setValue(false);
        }
    }

    movimientoEvaluate(event) {
        if (event.checked) {
            this.voucher.conLibreta.setValue(false);
        }
    }

    resetAll() {
        this.voucherForm.reset({});
        this.result.emit({});
    }

}



