import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants, RolConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { Region, RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { GestionEfectivoReports, GestionEfectivoReportsService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/gestion-efectivo-reports.service';
import { User } from 'src/@sirio/domain/services/security/auth.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-agencia-excedente-form',
    templateUrl: './reporte-agencia-excedente-form.component.html',
    styleUrls: ['./reporte-agencia-excedente-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteAgenciaExcedenteFormComponent extends FormBaseComponent implements OnInit {
    esGerente: Boolean = false;
    // esGerenteGeneral: Boolean = false;
    public regiones = new BehaviorSubject<Region[]>([]);
    gestionEfectivoReports: GestionEfectivoReports = {} as GestionEfectivoReports;
    todayValue: moment.Moment;
    valueMin: moment.Moment;
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private gestionEfectivoReportsService: GestionEfectivoReportsService,
        private sessionService: SessionService,
        private regionService: RegionService,
        private calendarioService: CalendarioService,   
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        this.buildForm();
        const user = this.sessionService.getUser() as User;
        this.esGerente = user.rols.includes(RolConstants.GERENTE_REGIONAL); 
        
        this.regionService.actives().subscribe(data => {
            this.regiones.next(data);
        });

        this.calendarioService.today().subscribe(data => {
            this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);                 
              //console.log("date:"+  this.todayValue) ;
       

               this.cdr.detectChanges();
            });      
    }

    buildForm() {
        this.itemForm = this.fb.group({
            region: new FormControl(undefined),
            fechainicio: new FormControl(moment(this.gestionEfectivoReports.fechainicio)),              
                fechafin: new FormControl(moment(this.gestionEfectivoReports.fechafin)),
        });
    }

    generate() {
        if (this.itemForm.invalid)
            return;
        this.updateData(this.gestionEfectivoReports);
        this.loadingDataForm.next(true);
        this.gestionEfectivoReportsService.agenciaExcedente(this.gestionEfectivoReports).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
        this.itemForm.reset({});
    }
}





 