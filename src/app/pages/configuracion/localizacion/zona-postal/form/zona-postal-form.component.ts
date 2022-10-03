import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Estado, EstadoService } from 'src/@sirio/domain/services/configuracion/localizacion/estado.service';
import { Municipio, MunicipioService } from 'src/@sirio/domain/services/configuracion/localizacion/municipio.service';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { Parroquia, ParroquiaService } from 'src/@sirio/domain/services/configuracion/localizacion/parroquia.service';
import { ZonaPostal, ZonaPostalService } from 'src/@sirio/domain/services/configuracion/localizacion/zona-postal.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-zona-postal-form',
    templateUrl: './zona-postal-form.component.html',
    styleUrls: ['./zona-postal-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ZonaPostalFormComponent extends FormBaseComponent implements OnInit {

    zonaPostal: ZonaPostal = {} as ZonaPostal;
    public parroquias = new BehaviorSubject<Parroquia[]>([]);
    public municipios = new BehaviorSubject<Municipio[]>([]);
    public paises = new BehaviorSubject<Pais[]>([]);
    public estados = new BehaviorSubject<Estado[]>([]);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private zonaPostalService: ZonaPostalService,
        private parroquiaService: ParroquiaService,
        private municipioService: MunicipioService,
        private estadoService: EstadoService,
        private paisService: PaisService,
        private cdr: ChangeDetectorRef) {
            super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.zonaPostalService.get(id).subscribe((agn: ZonaPostal) => {
                this.zonaPostal = agn;
                this.buildForm(this.zonaPostal);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.zonaPostal);
            this.loadingDataForm.next(false);
        }

        this.paisService.actives().subscribe(data => {
            this.paises.next(data);
        });
        
    }

    ngAfterViewInit(): void {

        this.loading$.subscribe(loading => {
            if (!loading) {

                if (this.f.pais.value) {

                    this.estadoService.activesByPais(this.f.pais.value).subscribe(data => {
                        this.estados.next(data);

                        this.cdr.detectChanges();
                    });
                }

                if (this.f.estado.value) {

                    this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
                        this.municipios.next(data);
                        this.cdr.detectChanges();
                    });
                }

                if (this.f.municipio.value) {
                    this.parroquiaService.activesByMunicipio(this.f.municipio.value).subscribe(data => {
                        this.parroquias.next(data);
                        this.cdr.detectChanges();
                    });
                }
            }
        });

    }

    buildForm(zonaPostal: ZonaPostal) {

        this.itemForm = this.fb.group({
            id: new FormControl({value: zonaPostal.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(zonaPostal.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            municipio: new FormControl(zonaPostal.municipio || undefined, [Validators.required]),
            estado: new FormControl(zonaPostal.estado || undefined, [Validators.required]),
            pais: new FormControl(zonaPostal.pais || undefined, [Validators.required]),
            parroquia: new FormControl(zonaPostal.parroquia || undefined, [Validators.required]),
            codigoPostal: [zonaPostal.codigoPostal || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
            codigoLocal: new FormControl(zonaPostal.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });

        this.f.pais.valueChanges.subscribe(value => {
            this.estadoService.activesByPais(this.f.pais.value).subscribe(data => {
                this.estados.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.estado.valueChanges.subscribe(value => {
                this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
                this.municipios.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.municipio.valueChanges.subscribe(value => {
                this.parroquiaService.activesByMunicipio(this.f.municipio.value).subscribe(data => {
                this.parroquias.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.id.valueChanges.subscribe(value => {
                    if (!this.f.id.errors && this.f.id.value.length > 0) {
                        this.codigoExists(value);
                    }
                });

        this.cdr.detectChanges();
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.zonaPostal);
        this.saveOrUpdate(this.zonaPostalService, this.zonaPostal, 'La Zona Postal', this.isNew);
    }

    private codigoExists(id) {
        this.zonaPostalService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.zonaPostal.id) {
            this.applyChangeStatus(this.zonaPostalService, this.zonaPostal, this.zonaPostal.nombre, this.cdr);
        }
    }

}