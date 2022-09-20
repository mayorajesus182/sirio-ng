import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import { FormBaseComponent } from 'app/shared/components/base/form-base.component';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { RegularExpConstants } from 'app/shared/constants/regularexp.constants';
import { appAnimations } from 'app/shared/animations/egret-animations';
import { SweetAlertService } from 'app/shared/services/swal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Municipio, MunicipioService } from 'app/shared/domain/services/configuracion/localizacion/municipio.service';
import { BehaviorSubject } from 'rxjs';
import { Pais, PaisService } from 'app/shared/domain/services/configuracion/localizacion/pais.service';
import { Estado, EstadoService } from 'app/shared/domain/services/configuracion/localizacion/estado.service';

@Component({
    selector: 'app-municipio-form',
    templateUrl: './municipio-form.component.html',
    styleUrls: ['./municipio-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: appAnimations
})

export class MunicipioFormComponent extends FormBaseComponent implements OnInit, AfterViewInit {

    municipio: Municipio = {} as Municipio;
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
        private municipioService: MunicipioService,
        private estadoService: EstadoService,
        private paisService: PaisService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
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

            }
        });



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

    buildForm(municipio: Municipio) {
        console.log(municipio);

        this.itemForm = this.fb.group({
            id: new FormControl({ value: municipio.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(municipio.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
            codigoLocal: new FormControl(municipio.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            estado: new FormControl(municipio.estado || '', [Validators.required]),
            pais: new FormControl(municipio.pais || '', [Validators.required]),
            ciudad: new FormControl(municipio.ciudad || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
        });

        this.f.pais.valueChanges.subscribe(value => {
            // console.log('change pais id');
            
            this.loadingDataForm.next(false);
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
        if (this.municipio.id) {
            this.applyChangeStatus(this.municipioService, this.municipio, this.municipio.nombre, this.cdr);
        }
    }

}
