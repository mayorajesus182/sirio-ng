import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { TipoProductoConstants } from 'src/@sirio/constants/tipo-producto.constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { TipoRenovacion, TipoRenovacionService } from 'src/@sirio/domain/services/configuracion/plazo-fijo/tipo-renovacion.service';
import { Plazo, PlazoService } from 'src/@sirio/domain/services/configuracion/producto/plazo.service';
import { TipoSubproducto, TipoSubproductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-subproducto.service';
import { CuentaBanco, CuentaBancoService } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { PlazoFijo, PlazoFijoService } from 'src/@sirio/domain/services/persona/plazo-fijo/plazo-fijo.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-plazo-fijo-form',
    templateUrl: './plazo-fijo-form.component.html',
    styleUrls: ['./plazo-fijo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class PlazoFijoFormComponent extends FormBaseComponent implements OnInit {

    public persona: Persona = {} as Persona;
    public tipoRenovaciones = new BehaviorSubject<TipoRenovacion[]>([]);
    public subproductos = new BehaviorSubject<TipoSubproducto[]>([]);
    public plazos = new BehaviorSubject<Plazo[]>([]);
    public cuentas = new BehaviorSubject<CuentaBanco[]>([]);
    public cuentasCapitalInteres = new BehaviorSubject<CuentaBanco[]>([]);
    plazoFijo: PlazoFijo = {} as PlazoFijo;
    todayValue: moment.Moment;
    montoMinimo: number = 0;
    montoMaximo: number = 0;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private plazoFijoService: PlazoFijoService,
        private calendarioService: CalendarioService,
        private cuentaBancoService: CuentaBancoService,
        private tipoSubproductoService: TipoSubproductoService,
        private plazoService: PlazoService,
        private tipoRenovacionService: TipoRenovacionService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.plazoFijoService.get(id).subscribe((plz: PlazoFijo) => {
                this.plazoFijo = plz;
                this.buildForm();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm();
            this.loadingDataForm.next(false);

            this.calendarioService.today().subscribe(data => {
                this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
                this.f.fecha.setValue(this.todayValue)
            });

        }

        this.plazoService.actives().subscribe(data => {
            this.plazos.next(data);
        });

        this.tipoRenovacionService.actives().subscribe(data => {
            this.tipoRenovaciones.next(data);
        });

        this.f.cuentaBancoCargo.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                let cuentaSelected = this.cuentas.value.filter(e => e.id == val)[0];
                this.f.moneda.setValue(cuentaSelected.moneda);
            }
        });

        this.f.plazo.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                let plazoSelected = this.plazos.value.filter(e => e.id == val)[0];
                this.f.fechaVencimiento.setValue(this.f.fecha.value.clone().add(plazoSelected.dias, 'd'))
            }
        });

        this.f.tipoSubproducto.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                let subproductoSelected = this.subproductos.value.filter(e => e.id == val)[0];
                this.montoMinimo = subproductoSelected.minimo;
                this.montoMaximo = subproductoSelected.maximo;
                this.f.monto.setErrors(undefined);
                this.f.monto.setValue(undefined);
                this.f.tasa.setValue(subproductoSelected.tasa);
            }
        });

        this.f.monto.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                this.f.interes.setValue(val * this.f.tasa.value / 100.0);
            }
        });
    }

    ngAfterViewInit(): void {
    }

    buildForm() {

        this.itemForm = this.fb.group({
            cuentaBancoCargo: new FormControl(this.plazoFijo.cuentaBancoCargo || undefined, [Validators.required]),
            fecha: new FormControl({ value: this.plazoFijo.fecha ? moment(this.plazoFijo.fecha, 'DD/MM/YYYY') : this.todayValue }, [Validators.required]),
            tipoSubproducto: new FormControl(this.plazoFijo.tipoSubproducto || undefined, [Validators.required]),
            moneda: new FormControl(this.plazoFijo.moneda || undefined, [Validators.required]),
            plazo: new FormControl(this.plazoFijo.plazo || undefined, [Validators.required]),
            fechaVencimiento: new FormControl({ value: this.plazoFijo.fechaVencimiento ? moment(this.plazoFijo.fechaVencimiento, 'DD/MM/YYYY') : '' }, [Validators.required]),
            monto: new FormControl(this.plazoFijo.monto || undefined, [Validators.required]),
            tasa: new FormControl(this.plazoFijo.tasa || undefined, [Validators.required]),
            interes: new FormControl(this.plazoFijo.interes || 0, [Validators.required]),
            cuentaBancoCapital: new FormControl(this.plazoFijo.cuentaBancoCapital || undefined, [Validators.required]),
            cuentaBancoInteres: new FormControl(this.plazoFijo.cuentaBancoInteres || undefined, [Validators.required]),
            renovacion: new FormControl(this.plazoFijo.renovacion || false),
            tipoRenovacion: new FormControl(this.plazoFijo.tipoRenovacion || undefined),
            certificado: new FormControl(''),
        });

        this.f.moneda.valueChanges.subscribe(value => {
            this.cuentaBancoService.allByPersonaAndMoneda(this.persona.id, value).subscribe(data => {
                this.cuentasCapitalInteres.next(data);
                this.cdr.detectChanges();
            });

            this.tipoSubproductoService.activesByTipoProductoAndTipoPersonaAndMoneda(TipoProductoConstants.PLAZO_FIJO, this.persona.tipoPersona, value).subscribe(data => {
                this.subproductos.next(data);
                this.cdr.detectChanges();
            });
        });
    }


    cleanForm() {
        this.f.cuentaBancoCargo.setValue(undefined);
        this.f.tipoSubproducto.setValue(undefined);
        this.f.fechaVencimiento.setValue('');
        this.f.plazo.setValue(undefined);
        this.f.monto.setValue(undefined);
        this.f.monto.setErrors(undefined);
        this.f.tasa.setValue(undefined);
        this.f.interes.setValue(undefined);
        this.f.cuentaBancoCapital.setValue(undefined);
        this.f.cuentaBancoInteres.setValue(undefined);
        this.f.renovacion.setValue(false);
        this.f.tipoRenovacion.setValue(undefined);
    }

    queryResult(event) {
        if (!event.id && !event.numper) {
            this.cleanForm();
            this.loaded$.next(false);
            this.persona = {} as Persona;
            this.cdr.detectChanges();

        } else {
            this.persona = event;
            this.loaded$.next(true);
            this.cuentaBancoService.allByPersona(this.persona.id).subscribe(data => {
                this.cuentas.next(data);
            });
        }


    }

    save() {
        if (this.itemForm.invalid)
            return;

        console.log('this.itemForm      ', this.itemForm.value);

        this.updateData(this.plazoFijo);
        this.plazoFijo.fecha = this.plazoFijo.fecha.format('DD/MM/YYYY');
        this.plazoFijo.fechaVencimiento = this.plazoFijo.fechaVencimiento.format('DD/MM/YYYY');
        this.plazoFijo.persona = this.persona.id;
        this.plazoFijo.renovacion = this.plazoFijo.renovacion ? 1 : 0;

        console.log('Subproducto      ', this.plazoFijo);


        this.saveOrUpdate(this.plazoFijoService, this.plazoFijo, 'El Plazo Fijo', this.isNew);
    }

}
