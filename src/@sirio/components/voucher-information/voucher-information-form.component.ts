import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, AfterViewInit, EventEmitter, Input,  Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { Deposito, DepositoService } from 'src/@sirio/domain/services/taquilla/deposito.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
@Component({
    selector: 'app-voucher-information-form',
    templateUrl: './voucher-information-form.component.html',
    styleUrls: ['./voucher-information-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class VoucherInformationFormComponent implements OnInit, AfterViewInit {
    voucher: FormGroup;
    isNew: boolean = false;
    @Input() tooltips: string = 'Crear';
    // @Input() taquilla: boolean = false;
    @Input() disabled: boolean = false;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    @Output('update') update: EventEmitter<any> = new EventEmitter<any>();
    @Output('create') create: EventEmitter<any> = new EventEmitter<any>();

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

        this.voucher = this.fb.group({
            tipoDocumentoDepositante: new FormControl('', Validators.required),
            identificacionDepositante: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            nombreDepositante: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            telefono: new FormControl(''),
            email: new FormControl(''),
        });


    }

    // add() {
    //     // console.log('crear persona ', this.searchForm.value);

    //     this.create.emit(this.voucher.value);
    // }

    resetAll() {
        this.voucher.reset({});
        this.result.emit({});
    }

}



