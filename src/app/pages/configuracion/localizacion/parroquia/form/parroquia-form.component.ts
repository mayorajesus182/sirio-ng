import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { RegularExpConstants } from 'app/shared/constants/regularexp.constants';
import { Estado, EstadoService } from 'app/shared/domain/services/configuracion/localizacion/estado.service';
import { Municipio, MunicipioService } from 'app/shared/domain/services/configuracion/localizacion/municipio.service';
import { Pais, PaisService } from 'app/shared/domain/services/configuracion/localizacion/pais.service';
import { Parroquia, ParroquiaService } from 'app/shared/domain/services/configuracion/localizacion/parroquia.service';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { SweetAlertService } from 'app/shared/services/swal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import PerfectScrollbar from 'perfect-scrollbar';
import { BehaviorSubject } from 'rxjs';


@Component({
    selector: 'app-parroquia-form',
    templateUrl: './parroquia-form.component.html',
    styleUrls: ['./parroquia-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: appAnimations
})

export class ParroquiaFormComponent extends FormBaseComponent implements OnInit {

    parroquia: Parroquia = {} as Parroquia;
    public municipios = new BehaviorSubject<Municipio[]>([]);
    public paises = new BehaviorSubject<Pais[]>([]);
    public estados = new BehaviorSubject<Estado[]>([]);

    a: PerfectScrollbar;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        snack: SnackbarService,
        spinner: NgxSpinnerService,
        swal: SweetAlertService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
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
            this.parroquiaService.get(id).subscribe((agn: Parroquia) => {
                this.parroquia = agn;
                this.buildForm(this.parroquia);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.parroquia);
            this.loadingDataForm.next(false);
        }

        if(!id){
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

                // console.log('load change events ');

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

    buildForm(parroquia: Parroquia) {
        this.itemForm = this.fb.group({
            id: new FormControl({value: parroquia.id || '', disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(parroquia.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_SPACE)]),
            municipio: new FormControl(parroquia.municipio || undefined, [Validators.required]),
            estado: new FormControl(parroquia.estado || undefined, [Validators.required]),
            pais: new FormControl(parroquia.pais || undefined, [Validators.required]),
            codigoLocal: new FormControl(parroquia.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
        });

        this.f.pais.valueChanges.subscribe(value => {
            // console.log('change pais id');
            this.estadoService.activesByPais(this.f.pais.value).subscribe(data => {
                this.estados.next(data);

                this.cdr.detectChanges();
            });
        });


        this.f.estado.valueChanges.subscribe(value => {
            // console.log('change pais id');
            
            // this.loadingDataForm.next(false);
            this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
                this.municipios.next(data);

                this.cdr.detectChanges();
            });
        });

        this.cdr.detectChanges();

        

    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.parroquia);
        this.saveOrUpdate(this.parroquiaService, this.parroquia, 'La Parroquia', this.isNew);
    }

    private codigoExists(id) {
        this.parroquiaService.exists(id).subscribe(data => {
            console.log(data.exists)
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.parroquia.id) {
            this.applyChangeStatus(this.parroquiaService, this.parroquia, this.parroquia.nombre, this.cdr);
        }
    }

}
