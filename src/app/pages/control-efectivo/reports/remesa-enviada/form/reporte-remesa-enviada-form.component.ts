import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { GlobalConstants } from 'src/@sirio/constants';
import * as moment from 'moment';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { GestionEfectivoReports, GestionEfectivoReportsService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/gestion-efectivo-reports.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';


@Component({
    selector: 'app-reporte-remesa-enviada-form',
    templateUrl: './reporte-remesa-enviada-form.component.html',
    styleUrls: ['./reporte-remesa-enviada-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteRemesaEnviadaFormComponent extends FormBaseComponent implements OnInit {

    gestionEfectivoReports: GestionEfectivoReports = {} as GestionEfectivoReports;
    todayValue: moment.Moment;
  
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private gestionEfectivoReportsService: GestionEfectivoReportsService,
        private regionService: RegionService,
        private calendarioService: CalendarioService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        this.buildForm();   
        
         this.calendarioService.today().subscribe(data => {
               this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);           
            
                this.cdr.detectChanges();
             });
       

        
        }

    buildForm() {
        this.itemForm = this.fb.group({          
            fechainicio: new FormControl(moment(this.gestionEfectivoReports.fechainicio)),
            fechafin: new FormControl(moment(this.gestionEfectivoReports.fechafin)),
       });

   
    }


    generate() {
        if (this.itemForm.invalid)
        return;

        this.updateData(this.gestionEfectivoReports);
        this.gestionEfectivoReportsService.remesaEnviada(this.gestionEfectivoReports).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
        this.itemForm.reset({});
    }
}


