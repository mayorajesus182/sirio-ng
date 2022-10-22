import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { TipoAtm, TipoAtmService } from 'src/@sirio/domain/services/configuracion/tipo-atm.service';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { Atm, AtmService } from 'src/@sirio/domain/services/organizacion/atm.service';
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
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.atm);
            this.loadingDataForm.next(false);
        }

        if (!id) {
            this.f.id.valueChanges.subscribe(value => {
                console.log('identificacioooooooooooooooonnnn ');
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.identificacionExists(value);
                }
            });
        }

        if (!id) {
            this.f.codigo.valueChanges.subscribe(value => {               
                if (!this.f.codigo.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

        this.agenciaService.actives().subscribe(data => {
            this.agencias.next(data);
        });

        this.transportistaService.actives().subscribe(data => {
            this.transportistas.next(data);
        });

        this.monedaService.actives().subscribe(data => {
            this.monedas.next(data);
        });

        this.tipoAtmService.actives().subscribe(data => {
            this.tipoAtms.next(data);
        });
    }


    buildForm(atm: Atm) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: atm.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            codigo: new FormControl({ value: atm.codigo || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
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
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.atm);
        this.saveOrUpdate(this.atmService, this.atm, 'El ATM', this.isNew);
    }

    private identificacionExists(id) {
        this.atmService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    private codigoExists(codigo) {
        this.atmService.existsByCodigo(codigo).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['codigo'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.atm.id) {
            this.applyChangeStatus(this.atmService, this.atm, this.atm.id, this.cdr);
        }
    }

}
