import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { Region, RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { Zona, ZonaService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/zona.service';
import { Estado, EstadoService } from 'src/@sirio/domain/services/configuracion/localizacion/estado.service';
import { Municipio, MunicipioService } from 'src/@sirio/domain/services/configuracion/localizacion/municipio.service';
import { Parroquia, ParroquiaService } from 'src/@sirio/domain/services/configuracion/localizacion/parroquia.service';
import { ZonaPostal, ZonaPostalService } from 'src/@sirio/domain/services/configuracion/localizacion/zona-postal.service';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-agencia-cupo-form',
    templateUrl: './agencia-cupo-form.component.html',
    styleUrls: ['./agencia-cupo-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class AgenciaCupoFormComponent extends FormBaseComponent implements OnInit {
    ciudad:string='';
    agencia: Agencia = {} as Agencia;
    public zonasPostales = new BehaviorSubject<ZonaPostal[]>([]);
    public parroquias = new BehaviorSubject<Parroquia[]>([]);
    public municipios = new BehaviorSubject<Municipio[]>([]);
    public estados = new BehaviorSubject<Estado[]>([]);
    public zonas = new BehaviorSubject<Zona[]>([]);
    public regiones = new BehaviorSubject<Region[]>([]);

    constructor(
        injector: Injector,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private agenciaService: AgenciaService,   
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
                this.applyFieldsDirty();
                this.cdr.detectChanges();
            });
        } else {
            this.buildForm(this.agencia);
            this.loadingDataForm.next(false);
        }
    }

    ngAfterViewInit(): void {
    }

    buildForm(agencia: Agencia) {
        this.itemForm = this.fb.group({
            id: [agencia.id || ''],
            nombre:  [agencia.nombre || ''],
          //  cupo: [agencia.cupo || undefined, [Validators.required]],
        });

        this.cdr.detectChanges();
        this.printErrors()
    }

    save() {
        if (this.itemForm.invalid)
            return;
            this.updateData(this.agencia);
            this.agencia.horarioExt = this.agencia.horarioExt?1:0
        this.saveOrUpdate(this.agenciaService, this.agencia, 'La Agencia', this.isNew);
    }

    private codigoExists(id) {
        this.agenciaService.exists(id).subscribe(data => {
            if (data.exists) {
                this.itemForm.controls['id'].setErrors({
                    exists: this.translateService.instant('error.codeExists')
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
