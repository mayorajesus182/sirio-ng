import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Usuario, UsuarioService } from 'src/@sirio/domain/services/autorizacion/usuario.service';
import { CuentaContable, CuentaContableService } from 'src/@sirio/domain/services/configuracion/contabilidad/cuenta-contable.service';
import { Region, RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { Zona, ZonaService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/zona.service';
import { Estado, EstadoService } from 'src/@sirio/domain/services/configuracion/localizacion/estado.service';
import { Municipio, MunicipioService } from 'src/@sirio/domain/services/configuracion/localizacion/municipio.service';
import { Parroquia, ParroquiaService } from 'src/@sirio/domain/services/configuracion/localizacion/parroquia.service';
import { ZonaPostal, ZonaPostalService } from 'src/@sirio/domain/services/configuracion/localizacion/zona-postal.service';
import { Telefonica, TelefonicaService } from 'src/@sirio/domain/services/configuracion/telefono/telefonica.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-transportista-form',
    templateUrl: './transportista-form.component.html',
    styleUrls: ['./transportista-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TransportistaFormComponent extends FormBaseComponent implements OnInit {

    ciudad: string = '';
    transportista: Transportista = {} as Transportista;
    public zonasPostales = new BehaviorSubject<ZonaPostal[]>([]);
    public parroquias = new BehaviorSubject<Parroquia[]>([]);
    public municipios = new BehaviorSubject<Municipio[]>([]);
    public estados = new BehaviorSubject<Estado[]>([]);
    public zonas = new BehaviorSubject<Zona[]>([]);
    public regiones = new BehaviorSubject<Region[]>([]);
    public tiposDocumentos = new BehaviorSubject<TipoDocumento[]>([]);
    public cuentasContables = new BehaviorSubject<CuentaContable[]>([]);
    public usuarios = new BehaviorSubject<Usuario[]>([]);
    public telefonicas = new BehaviorSubject<Telefonica[]>([]);

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private transportistaService: TransportistaService,
        private zonaPostalService: ZonaPostalService,
        private parroquiaService: ParroquiaService,
        private municipioService: MunicipioService,
        private tipoDocumentoService: TipoDocumentoService,
        private estadoService: EstadoService,
        private zonaService: ZonaService,
        private regionService: RegionService,
        private cuentaContableService: CuentaContableService,
        private usuarioService: UsuarioService,
        private telefonicaService: TelefonicaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.transportistaService.get(id).subscribe((agn: Transportista) => {
                this.transportista = agn;
                this.buildForm(this.transportista);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.transportista);
            this.loadingDataForm.next(false);
        }

        // TODO: EL PAIS DEBE PROCEDER DE LA INSTITUCION

        this.estadoService.activesByPais(GlobalConstants.PAIS_LOCAL).subscribe(data => {
            this.estados.next(data);
            this.cdr.detectChanges();
        });

        this.zonaService.actives().subscribe(data => {
            this.zonas.next(data);
            this.cdr.detectChanges();
        });

        this.cuentaContableService.actives().subscribe(data => {
            this.cuentasContables.next(data);
            this.cdr.detectChanges();
        });

        this.usuarioService.actives().subscribe(data => {
            this.usuarios.next(data);
            this.cdr.detectChanges();
        });

        this.tipoDocumentoService.activesJuridicos().subscribe(data => {
            this.tiposDocumentos.next(data);
            this.cdr.detectChanges();
        });

        this.telefonicaService.actives().subscribe(data => {
            this.telefonicas.next(data);
            this.cdr.detectChanges();
        });

        if (!id) {
            this.f.id.valueChanges.subscribe(value => {
                if (!this.f.id.errors && this.f.id.value.length > 0) {
                    this.codigoExists(value);
                }
            });
        }

    }

    // TODO: REVISAR ETIQUETAS 

    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {
            if (!loading) {
                if (this.f.estado.value) {
                    this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
                        this.municipios.next(data);
                        this.ciudad = this.municipios.value.filter(m => m.id === this.f.municipio.value).map(m => m.ciudad)[0];
                        this.cdr.detectChanges();
                    });
                }

                if (this.f.municipio.value) {
                    this.parroquiaService.activesByMunicipio(this.f.municipio.value).subscribe(data => {
                        this.parroquias.next(data);
                        this.cdr.detectChanges();
                    });
                }

                if (this.f.parroquia.value) {
                    this.zonaPostalService.activesByParroquia(this.f.parroquia.value).subscribe(data => {
                        this.zonasPostales.next(data);
                        this.cdr.detectChanges();
                    });
                }

                if (this.f.zona.value) {
                    this.regionService.activesByZona(this.f.zona.value).subscribe(data => {
                        this.regiones.next(data);
                        this.cdr.detectChanges();
                    });
                }
            }
        });

    }

    buildForm(transportista: Transportista) {
        this.itemForm = this.fb.group({
            id: new FormControl({ value: transportista.id || '', disabled: !this.isNew }, [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            nombre: new FormControl(transportista.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            tipoDocumento: new FormControl(transportista.tipoDocumento || undefined, [Validators.required]),
            identificacion: new FormControl(transportista.identificacion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC)]),
            zonaPostal: new FormControl(transportista.zonaPostal || undefined, [Validators.required]),
            parroquia: new FormControl(transportista.parroquia || undefined, [Validators.required]),
            municipio: new FormControl(transportista.municipio || undefined, [Validators.required]),
            estado: new FormControl(transportista.estado || undefined, [Validators.required]),
            region: new FormControl(transportista.region || undefined, [Validators.required]),
            zona: new FormControl(transportista.zona || undefined, [Validators.required]),
            jurisdiccion: new FormControl(transportista.jurisdiccion || undefined, [Validators.required]),
            direccion: new FormControl(transportista.direccion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]),
            email: new FormControl(transportista.email || ''),
            telefono: new FormControl(transportista.telefono || '', [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]),
            telefonoAlt: new FormControl(transportista.telefonoAlt || '', Validators.pattern(RegularExpConstants.NUMERIC)),
            latitud: new FormControl(transportista.latitud || undefined, [Validators.required]),
            longitud: new FormControl(transportista.longitud || undefined, [Validators.required]),
            esCentroAcopio: new FormControl(transportista.esCentroAcopio === 1),
            cuentaContable: new FormControl(transportista.cuentaContable || undefined),
            tesorero: new FormControl(transportista.tesorero || undefined),
        });

        this.f.estado.valueChanges.subscribe(value => {
            this.f.municipio.setValue(undefined);
            this.municipios.next([]);
            this.ciudad = '';
            this.municipioService.activesByEstado(value).subscribe(data => {
                this.municipios.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.municipio.valueChanges.subscribe(value => {
            this.ciudad = this.municipios.value.filter(m => m.id === value).map(m => m.ciudad)[0];
            this.f.parroquia.setValue(undefined);
            this.parroquias.next([]);
            this.parroquiaService.activesByMunicipio(value).subscribe(data => {
                this.parroquias.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.parroquia.valueChanges.subscribe(value => {
            this.f.zonaPostal.setValue(undefined);
            this.zonasPostales.next([]);
            this.zonaPostalService.activesByParroquia(value).subscribe(data => {
                this.zonasPostales.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.zona.valueChanges.subscribe(value => {
            this.f.region.setValue(undefined);
            this.regiones.next([]);
            this.regionService.activesByZona(value).subscribe(data => {
                this.regiones.next(data);
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

    private codigoExists(id) {
        this.transportistaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: true
                });
                this.cdr.detectChanges();
            }
        });
    }

    centroAcopioEvaluate(event) {
        if (!event.checked) {
            this.f.tesorero.setValue(undefined);
            this.f.cuentaContable.setValue(undefined);
            this.f.tesorero.setErrors(undefined);
            this.f.cuentaContable.setErrors(undefined);
        }
    }

    activateOrInactivate() {
        if (this.transportista.id) {
            this.applyChangeStatus(this.transportistaService, this.transportista, this.transportista.nombre, this.cdr);
        }
    }

    save() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.transportista);
        this.transportista.esCentroAcopio = this.transportista.esCentroAcopio ? 1 : 0
        console.log(this.transportista);

        this.saveOrUpdate(this.transportistaService, this.transportista, 'El Transportista', this.isNew);
    }

}
