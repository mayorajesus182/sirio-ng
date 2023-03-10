import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RolConstants } from 'src/@sirio/constants';
import { Region, RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { GestionEfectivoReports, GestionEfectivoReportsService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/gestion-efectivo-reports.service';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { User } from 'src/@sirio/domain/services/security/auth.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-cupo-agencia-form',
    templateUrl: './reporte-cupo-agencia-form.component.html',
    styleUrls: ['./reporte-cupo-agencia-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteCupoAgenciaFormComponent extends FormBaseComponent implements OnInit {
    // esOperadorAgencia: Boolean = false;
    public regiones = new BehaviorSubject<Region[]>([]);
    public agencias = new BehaviorSubject<Agencia[]>([]);
    esGteRegional: Boolean = false;
    gestionEfectivoReportes: GestionEfectivoReports = {} as GestionEfectivoReports;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private sessionService: SessionService,
        private gestionEfectivoReportsService: GestionEfectivoReportsService,
        // private sessionService: SessionService,
        private regionService: RegionService,
        private agenciaService: AgenciaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        this.buildForm();
        const user = this.sessionService.getUser() as User;        
        this.esGteRegional = user.rols.includes(RolConstants.GERENTE_REGIONAL);

        if(this.esGteRegional){

            this.agenciaService.findActivesByRegion(user.unityId).subscribe(data => {
                this.agencias.next(data);
                this.cdr.detectChanges();
            });
            
        }else{
            this.regionService.actives().subscribe(data => {
                this.regiones.next(data);
            });
        }
        // const user = this.sessionService.getUser() as User;
        // this.esOperadorAgencia = user.rols.includes(RolConstants.GERENTE_TESORERO_AGENCIA);

    }

    buildForm() {
        this.itemForm = this.fb.group({
            region: new FormControl(undefined),
            agencia: new FormControl(undefined),
        });

        this.f.region.valueChanges.subscribe(value => {
            this.agenciaService.findActivesByRegion(value).subscribe(data => {
                this.agencias.next(data);
                this.cdr.detectChanges();
            });
        });
    }

    generate() {
        if (this.itemForm.invalid)
            return;

        this.updateData(this.gestionEfectivoReportes);
        this.loadingDataForm.next(true);
        this.gestionEfectivoReportsService.cupoAgencia(this.gestionEfectivoReportes).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
        this.f.agencia.reset({});
    }













}
