import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Estado, EstadoService } from 'src/@sirio/domain/services/configuracion/localizacion/estado.service';
import { Municipio, MunicipioService } from 'src/@sirio/domain/services/configuracion/localizacion/municipio.service';
import { Parroquia, ParroquiaService } from 'src/@sirio/domain/services/configuracion/localizacion/parroquia.service';
import { ZonaPostal, ZonaPostalService } from 'src/@sirio/domain/services/configuracion/localizacion/zona-postal.service';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-agencia-form',
    templateUrl: './agencia-form.component.html',
    styleUrls: ['./agencia-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class AgenciaFormComponent extends FormBaseComponent implements OnInit {
    ciudad:string='';
    agencia: Agencia = {} as Agencia;
    public zonasPostales = new BehaviorSubject<ZonaPostal[]>([]);
    public parroquias = new BehaviorSubject<Parroquia[]>([]);
    public municipios = new BehaviorSubject<Municipio[]>([]);
    public estados = new BehaviorSubject<Estado[]>([]);


    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private agenciaService: AgenciaService,
        private zonaPostalService: ZonaPostalService,
        private parroquiaService: ParroquiaService,
        private municipioService: MunicipioService,
        private estadoService: EstadoService,        
        private cdr: ChangeDetectorRef) {
        super(undefined,  injector);
    }

    ngOnInit() {

        let id = this.route.snapshot.params['id'];
        this.isNew = id == undefined;
        this.loadingDataForm.next(true);

        if (id) {
            this.agenciaService.get(id).subscribe((agn: Agencia) => {
                this.agencia = agn;
                this.agencia.id=id;
                this.buildForm(this.agencia);
                this.cdr.markForCheck();
                this.loadingDataForm.next(false);
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.agencia);
            this.loadingDataForm.next(false);
        }
    

        this.estadoService.activesByPais(GlobalConstants.PAIS_LOCAL).subscribe(data => {
            this.estados.next(data);
            this.cdr.detectChanges();
        });

    }

    ngAfterViewInit(): void {
        this.loading$.subscribe(loading => {
            if (!loading) {
                if (this.f.estado.value) {
                    console.log(this.f.estado.value);
                    
                    this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
                        // console.log(data);
                        this.municipios.next(data);
                        this.ciudad=this.municipios.value.filter(m=>m.id===this.f.municipio.value).map(m=>m.ciudad)[0];  
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
            }
        });

    }

    buildForm(agencia: Agencia) {

        console.log(agencia);
        
        this.itemForm = this.fb.group({
            codigo: [agencia.codigo || '', {disabled: !this.isNew}, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)]],
            nombre:  [agencia.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]],
            parroquia: [agencia.parroquia || undefined, [Validators.required]],
            municipio: [agencia.municipio || undefined, [Validators.required]],
            estado: [agencia.estado || undefined, [Validators.required]],
            direccion:  [agencia.direccion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)]],
            email:  [agencia.email || '', [Validators.required]],
            telefono:  [agencia.telefono || '', [Validators.required]],
            telefonoAlt:  [agencia.telefonoAlt || ''],
            latitud:  [agencia.latitud || '', [Validators.required]],
            longitud:  [agencia.longitud || '', [Validators.required]],
            zonaPostal: [agencia.zonaPostal || undefined, [Validators.required]],
            horarioExt: [agencia.horarioExt===1 || false],
        });

        this.f.estado.valueChanges.subscribe(value => {
            this.ciudad='';
            this.municipioService.activesByEstado(value).subscribe(data => {
                this.municipios.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.municipio.valueChanges.subscribe(value => {  
            this.ciudad=this.municipios.value.filter(m=>m.id===value).map(m=>m.ciudad)[0];         
            this.parroquiaService.activesByMunicipio(value).subscribe(data => {
                this.parroquias.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.parroquia.valueChanges.subscribe(value => {           
            this.zonaPostalService.activesByParroquia(value).subscribe(data => {
                this.zonasPostales.next(data);
                this.cdr.detectChanges();
            });
        });

        this.f.codigo.valueChanges.subscribe(value => {
            if (!this.f.codigo.errors && this.f.codigo.value.length > 0) {
                this.codigoExists(value);
            }
        });

        this.cdr.detectChanges();
        this.printErrors()
    }

    save() {
        if (this.itemForm.invalid)
            return;
            this.updateData(this.agencia);
            console.log(this.agencia);
            this.agencia.horarioExt = this.agencia.horarioExt?1:0
        this.saveOrUpdate(this.agenciaService, this.agencia, 'El Agencia', this.isNew);
    }

    private codigoExists(codigo) {
        this.agenciaService.exists(codigo).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['codigo'].setErrors({
                    exists: "El código existe"
                });
                this.cdr.detectChanges();
            }
        });
    }

    activateOrInactivate() {
        if (this.agencia.id) {
            this.applyChangeStatus(this.agenciaService, this.agencia, this.agencia.nombre, this.cdr);
        }
    }

}
