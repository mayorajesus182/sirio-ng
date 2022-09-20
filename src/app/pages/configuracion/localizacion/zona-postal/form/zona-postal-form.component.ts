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
import { ZonaPostal, ZonaPostalService } from 'app/shared/domain/services/configuracion/localizacion/zona.postal.service';
import { SnackbarService } from 'app/shared/services/snackbar.service';
import { SweetAlertService } from 'app/shared/services/swal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import PerfectScrollbar from 'perfect-scrollbar';
import { BehaviorSubject } from 'rxjs';


@Component({
    selector: 'app-zona-postal-form',
    templateUrl: './zona-postal-form.component.html',
    styleUrls: ['./zona-postal-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: appAnimations
})

export class ZonaPostalFormComponent extends FormBaseComponent implements OnInit {

    zonaPostal: ZonaPostal = {} as ZonaPostal;
    public parroquias = new BehaviorSubject<Parroquia[]>([]);
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
        private zonaPostalService: ZonaPostalService,
        private parroquiaService: ParroquiaService,
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
            this.zonaPostalService.get(id).subscribe((agn: ZonaPostal) => {
                this.zonaPostal = agn;
                this.buildForm(this.zonaPostal);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
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

        console.log('zona ', zonaPostal);


        this.itemForm = this.fb.group({
            nombre:  [zonaPostal.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]],
            parroquia: [zonaPostal.parroquia || undefined, [Validators.required]],
            municipio: [zonaPostal.municipio || undefined, [Validators.required]],
            estado: [zonaPostal.estado || undefined, [Validators.required]],
            pais: [zonaPostal.pais || undefined, [Validators.required]],
            codigoPostal: [zonaPostal.codigoPostal || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
            codigoLocal: [zonaPostal.codigoLocal || '', [Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]],
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
            console.log('change municipio ', value);

            // this.loadingDataForm.next(false);
            this.parroquiaService.activesByMunicipio(this.f.municipio.value).subscribe(data => {
                this.parroquias.next(data);

                this.cdr.detectChanges();
            });
        });


        this.cdr.detectChanges();
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.zonaPostal);
        this.saveOrUpdate(this.zonaPostalService, this.zonaPostal, 'La Zoona Postal', this.isNew);
    }

    activateOrInactivate() {
        if (this.zonaPostal.id) {
            this.applyChangeStatus(this.zonaPostalService, this.zonaPostal, this.zonaPostal.nombre, this.cdr);
        }
    }

}
