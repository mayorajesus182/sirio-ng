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
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-municipio-form',
    templateUrl: './municipio-form.component.html',
    styleUrls: ['./municipio-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class MunicipioFormComponent extends FormBaseComponent implements OnInit {

    public municipios = new BehaviorSubject<Municipio[]>([]);
    public paises = new BehaviorSubject<Pais[]>([]);
    public estados = new BehaviorSubject<Estado[]>([]);

    municipio: Municipio = {} as Municipio;
    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private municipioService: MunicipioService,
        private estadoService: EstadoService,
        private paisService: PaisService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.municipioService.get(id).subscribe((agn: Municipio) => {
                this.municipio = agn;
                this.buildForm(this.municipio);
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.municipio);
            this.loadingDataForm.next(false);
        }

        if (!id) {
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
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

            }
        });

    }

    buildForm(municipio: Municipio) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: municipio.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(municipio.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            ciudad: new FormControl(municipio.ciudad || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            estado: new FormControl(municipio.estado || '', [Validators.required]),
            pais: new FormControl(municipio.pais || '', [Validators.required]),
            codigoLocal: new FormControl(municipio.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });

        this.f.pais.valueChanges.subscribe(value => {
            if(value){
                this.f.estado.setValue(undefined);
                this.estados.next([]);
                this.estadoService.activesByPais(value).subscribe(data => {
                    this.estados.next(data);
                    this.cdr.detectChanges();
                });
            }
        });


        this.f.estado.valueChanges.subscribe(value => {
            if(value){
                this.municipioService.activesByEstado(value).subscribe(data => {
                    this.municipios.next(data);
                    this.cdr.detectChanges();
                });
            }
        });

        this.cdr.detectChanges();
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.municipio);
        this.saveOrUpdate(this.municipioService, this.municipio, 'El Municipio', this.isNew);
    }

    private codigoExists(id) {
        this.municipioService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.municipio.id) {
            this.applyChangeStatus(this.municipioService, this.municipio, this.municipio.nombre, this.cdr);
        }
    }

}