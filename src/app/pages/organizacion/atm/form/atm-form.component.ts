import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoAtm, TipoAtmService } from 'src/@sirio/domain/services/configuracion/tipo-atm.service';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { Atm, AtmService } from 'src/@sirio/domain/services/organizacion/atm.service';
import { Cajetin } from 'src/@sirio/domain/services/organizacion/cajetin.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-atm-form',
    templateUrl: './atm-form.component.html',
    styleUrls: ['./atm-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class AtmFormComponent extends FormBaseComponent implements OnInit {

    atm: Atm = {} as Atm;
    public agencias = new BehaviorSubject<Agencia[]>([]);
    public transportistas = new BehaviorSubject<Transportista[]>([]);
    public tipoAtms = new BehaviorSubject<TipoAtm[]>([]);
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public cajetines = new BehaviorSubject<Cajetin[]>([]);
    public conos: ConoMonetario[] = [];
    remoto = GlobalConstants.REMOTO;
    oficina = GlobalConstants.OFICINA;

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private atmService: AtmService,
        private agenciaService: AgenciaService,
        private transportistaService: TransportistaService,
        private monedaService: MonedaService,
        private tipoAtmService: TipoAtmService,
        private conoMonetarioService: ConoMonetarioService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.atmService.get(id).subscribe((agn: Atm) => {
                this.atm = agn;
                this.buildForm(this.atm);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cajetines = new BehaviorSubject<Cajetin[]>(this.atm.cajetines);

                this.conoMonetarioService.activesBilletesByMoneda(this.atm.moneda).subscribe((result) => {
                    this.conos = result.slice();
                });

                this.applyFieldsDirty();
                this.cdr.detectChanges();                
            });

        } else {

            this.buildForm(this.atm);
            this.loadingDataForm.next(false);

            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });

            this.f.identificacion.valueChanges.subscribe(value => {
                if (!this.f.identificacion.errors && this.f.identificacion.value.length > 0) {
                    this.identificacionExists(value);
                }
            });

            this.loadCajetines();
        }

        this.agenciaService.actives().subscribe(data => {
            this.agencias.next(data);
        });

        this.transportistaService.actives().subscribe(data => {
            this.transportistas.next(data);
        });

        this.monedaService.paraAtmActives().subscribe(data => {
            this.monedas.next(data);
        });

        this.tipoAtmService.actives().subscribe(data => {
            this.tipoAtms.next(data);
        });

    }

    loadCajetines() {
        this.atmService.getCajetines().subscribe((data) => {
            this.cajetines.next(data.slice());
        });
    }


    buildForm(atm: Atm) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: atm.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            identificacion: new FormControl({ value: atm.identificacion || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            moneda: new FormControl(atm.moneda || undefined, [Validators.required]),
            tipoAtm: new FormControl(atm.tipoAtm || undefined, [Validators.required]),
            agencia: new FormControl(atm.agencia || undefined),
            transportista: new FormControl(atm.transportista || undefined),
        });

        this.f.tipoAtm.valueChanges.subscribe(value => {
            this.f.agencia.setValue(undefined);
            this.f.transportista.setValue(undefined);
            this.cdr.detectChanges();
        });

        this.f.moneda.valueChanges.subscribe(value => {
            if (value) {
                this.conoMonetarioService.activesBilletesByMoneda(value).subscribe((result) => {
                    this.conos = result.slice();
                });
                this.cdr.detectChanges();
            }
        });
    }

    private codigoExists(id) {
        this.atmService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    private identificacionExists(identificacion) {
        this.atmService.existsByIdentificacion(identificacion).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['identificacion'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    selectConoMonetario(event, row: Cajetin) {
        row.conoMonetario = Number.parseInt((event.target as HTMLSelectElement).value);
    }

    activateOrInactivate() {
        if (this.atm.id) {
            this.applyChangeStatus(this.atmService, this.atm, this.atm.id, this.cdr);
        }
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.atm);
        this.atm.cajetines = this.cajetines.value;

        this.saveOrUpdate(this.atmService, this.atm, 'El ATM', this.isNew);
   
        if (this.isNew)  {
            this.loadCajetines();
        }
   
    }

}
