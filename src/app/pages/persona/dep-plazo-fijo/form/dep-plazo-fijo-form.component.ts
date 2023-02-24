import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { PlazoDPF, PlazoDPFService } from 'src/@sirio/domain/services/configuracion/plazo-fijo/plazo.service';
import { TasaDPF, TasaDPFService } from 'src/@sirio/domain/services/configuracion/plazo-fijo/tasa-dpf.service';
import { TipoRenovacion, TipoRenovacionService } from 'src/@sirio/domain/services/configuracion/plazo-fijo/tipo-renovacion.service';
import { TipoProducto, TipoProductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-producto.service';
import { TipoSubproducto, TipoSubproductoService } from 'src/@sirio/domain/services/configuracion/producto/tipo-subproducto.service';
import { CuentaBanco, CuentaBancoService } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { PlazoFijo, PlazoFijoService } from 'src/@sirio/domain/services/persona/plazo-fijo/plazo-fijo.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-dep-plazo-fijo-form',
    templateUrl: './dep-plazo-fijo-form.component.html',
    styleUrls: ['./dep-plazo-fijo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class DepPlazoFijoFormComponent extends FormBaseComponent implements OnInit {

    public persona: Persona = {} as Persona;
    public tasas = new BehaviorSubject<TasaDPF[]>([]);
    public tipoRenovaciones = new BehaviorSubject<TipoRenovacion[]>([]);
    public productos = new BehaviorSubject<TipoProducto[]>([]);
    public subproductos = new BehaviorSubject<TipoSubproducto[]>([]);
    public plazos = new BehaviorSubject<PlazoDPF[]>([]);
    public cuentas = new BehaviorSubject<CuentaBanco[]>([]);
    public cuentasCapitalInteres = new BehaviorSubject<CuentaBanco[]>([]);
    plazoFijo: PlazoFijo = {} as PlazoFijo;
    todayValue: moment.Moment;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private plazoFijoService: PlazoFijoService,
        private calendarioService: CalendarioService,
        private cuentaBancoService: CuentaBancoService,
        private tasaDPFService: TasaDPFService,
        private tipoProductoService: TipoProductoService,
        private tipoSubproductoService: TipoSubproductoService,
        private plazoDPFService: PlazoDPFService,
        private tipoRenovacionService: TipoRenovacionService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        this.calendarioService.today().subscribe(data => {
            this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
            if (!this.f.fecha.value) {
                this.f.fecha.setValue(this.todayValue)
            }
        });

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
        }

        this.tipoProductoService.actives().subscribe(data => {
            this.productos.next(data);
        });

        this.plazoDPFService.actives().subscribe(data => {
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

        this.f.tasa.valueChanges.subscribe(val => {
            if (val && (val != '')) {
                let tasaSelected = this.tasas.value.filter(e => e.id == val)[0];
                this.f.porcentaje.setValue(tasaSelected.porcentaje);
            }
        });
    }

    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {

            if (!loading) {
                if (this.itemForm && this.f.tipoProducto.value) {
                    this.tipoSubproductoService.activesByTipoProductoAndTipoPersona(this.f.tipoProducto.value, this.persona.tipoPersona).subscribe(data => {
                        this.subproductos.next(data);
                    });
                }

                if (this.itemForm && this.f.tipoSubproducto.value) {
                    this.tasaDPFService.activesByTipoSubproducto(this.f.tipoSubproducto.value).subscribe(data => {
                        this.tasas.next(data);
                    });
                }
                this.cdr.detectChanges();
            }
        });
    }

    buildForm() {

        this.itemForm = this.fb.group({
            cuentaBancoCargo: new FormControl(this.plazoFijo.cuentaBancoCargo || undefined, [Validators.required]),
            fecha: new FormControl({ value: this.plazoFijo.fecha ? moment(this.plazoFijo.fecha, 'DD/MM/YYYY') : this.todayValue }, [Validators.required]),
            tipoProducto: new FormControl(this.plazoFijo.tipoProducto || undefined, [Validators.required]),
            tipoSubproducto: new FormControl(this.plazoFijo.tipoSubproducto || undefined, [Validators.required]),
            moneda: new FormControl(this.plazoFijo.moneda || undefined, [Validators.required]),
            plazo: new FormControl(this.plazoFijo.plazo || undefined, [Validators.required]),
            fechaVencimiento: new FormControl({ value: this.plazoFijo.fechaVencimiento ? moment(this.plazoFijo.fechaVencimiento, 'DD/MM/YYYY') : '' }, [Validators.required]),
            monto: new FormControl(this.plazoFijo.monto || undefined, [Validators.required]),
            tasa: new FormControl(this.plazoFijo.tasa || undefined, [Validators.required]),
            porcentaje: new FormControl(this.plazoFijo.porcentaje || undefined, [Validators.required]),
            cuentaBancoCapital: new FormControl(this.plazoFijo.cuentaBancoCapital || undefined, [Validators.required]),
            cuentaBancoInteres: new FormControl(this.plazoFijo.cuentaBancoInteres || undefined, [Validators.required]),
            renovacion: new FormControl(this.plazoFijo.renovacion || false),
            tipoRenovacion: new FormControl(this.plazoFijo.tipoRenovacion || undefined),
            certificado: new FormControl(''),
        });

        this.f.tipoProducto.valueChanges.subscribe(value => {
            this.f.tipoSubproducto.setValue(undefined);
            if (value) {
                this.tipoSubproductoService.activesByTipoProductoAndTipoPersona(value, this.persona.tipoPersona).subscribe(data => {
                    this.subproductos.next(data);
                    this.cdr.detectChanges();
                });
            }
        });

        this.f.tipoSubproducto.valueChanges.subscribe(value => {
            this.f.tasa.setValue(undefined);
            if (value) {
                this.tasaDPFService.activesByTipoSubproducto(value).subscribe(data => {
                    this.tasas.next(data);
                    this.cdr.detectChanges();
                });
            }
        });

        this.f.moneda.valueChanges.subscribe(value => {
            this.cuentaBancoService.allByPersonaAndMoneda(this.persona.id, value).subscribe(data => {
                this.cuentasCapitalInteres.next(data);
                this.cdr.detectChanges();
            });

        });
    }

    queryResult(event) {

        if (!event.id && !event.numper) {
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

        this.updateData(this.plazoFijo);
        this.plazoFijo.fecha = this.plazoFijo.fecha.format('DD/MM/YYYY');
        this.plazoFijo.fechaVencimiento = this.plazoFijo.fechaVencimiento.format('DD/MM/YYYY');
        this.plazoFijo.persona = this.persona.id;
        this.plazoFijo.renovacion = this.plazoFijo.renovacion ? 1 : 0;
        
        this.saveOrUpdate(this.plazoFijoService, this.plazoFijo, 'El Plazo Fijo', this.isNew);
    }

}
