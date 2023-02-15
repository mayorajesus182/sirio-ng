import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { CuentaBancaria, CuentaBancariaService } from 'src/@sirio/domain/services/cuenta-bancaria.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'sirio-entrega-form',
    templateUrl: './entrega-form.component.html',
    styleUrls: ['./entrega-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation],
})

export class EntregaFormComponent extends FormBaseComponent implements OnInit {

    @Input() persona: Persona = {} as Persona;
    @Output('result') result: EventEmitter<any> = new EventEmitter<any>();
    public cuentasBancarias = new BehaviorSubject<CuentaBancaria[]>([]);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private cuentaBancariaService: CuentaBancariaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.itemForm = this.fb.group({
            // numper: new FormControl(undefined, [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            // cuentaBancaria: new FormControl(undefined),
            // moneda: new FormControl(undefined),
            // tipoDocumento: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            // identificacion: new FormControl('', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            // tipoProducto: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            // operacion: new FormControl(''),
            tipoTarjeta: new FormControl(''),
            numeroTarjeta: new FormControl(''),
            numeroCuenta: new FormControl(''),
            nombreEstampacion: new FormControl('', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            email: new FormControl(''),          
        });

        this.cargaDatos();
        //Me trae la data de la cuenta que se selecciono
        this.f.numeroCuenta.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                this.cuentasBancarias.value.filter(e => e.id == val)[0];
            }
        });
        this.cdr.detectChanges();
    }

    ngAfterViewInit(): void {
        this.itemForm.valueChanges.subscribe(val => {
            if (val) {
                this.result.emit(this.itemForm)
            }
        });
        this.cdr.detectChanges();
    }

    cargaDatos() {
        if (this.persona) {
            if (!this.persona.id) {
                this.loaded$.next(false);
                this.persona = {} as Persona;
            } else {
                this.cuentaBancariaService.activesByNumper(this.persona.numper).subscribe(data => {
                    this.cuentasBancarias.next(data);
                    if (data.length === 1) {
                        this.f.numeroCuenta.setValue(data[0].id);
                    }
                });
            }
            this.cdr.detectChanges();
        }
    }

    reset() {
        // this.itemForm?this.itemForm.reset({}):'';
        this.itemForm.reset({});
        this.loaded$.next(false)
        // this.cargaDatos();
        // console.log("Resetear", this.itemForm.value);
        this.cdr.detectChanges();
    }
}



