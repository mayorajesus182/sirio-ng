import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RolConstants } from 'src/@sirio/constants';
import { Region, RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { ReporteGestionEfectivoAgencia, ReporteGestionEfectivoAgenciaService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/reports-gestion-efectivo-agencia.service';
import { User } from 'src/@sirio/domain/services/security/auth.service';
import { RolService } from 'src/@sirio/domain/services/workflow/rol.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
@Component({
    selector: 'app-reporte-taquilla-operativa-form',
    templateUrl: './reporte-taquilla-operativa-form.component.html',
    styleUrls: ['./reporte-taquilla-operativa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteTaquillaOperativaFormComponent extends FormBaseComponent implements OnInit {

    public regiones = new BehaviorSubject<Region[]>([]);
    reporteGestionEfectivoAgencia: ReporteGestionEfectivoAgencia = {} as ReporteGestionEfectivoAgencia;
    esGteRegional: Boolean = false;
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private reporteGestionEfectivoAgenciaService: ReporteGestionEfectivoAgenciaService,
        private regionService: RegionService,
        private sessionService: SessionService,
        private rolService: RolService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        const user = this.sessionService.getUser() as User;
        this.esGteRegional = user.rols.includes(RolConstants.GERENTE_REGIONAL);
        console.log("esGteRegional", this.esGteRegional); 
        this.buildForm();
       
     //  if (this.esGteRegional) {
           
           

        this.regionService.actives().subscribe(data => {
            this.regiones.next(data);
        });
       
      //  }
       
       this.cdr.detectChanges();
  
  
  
    }

    buildForm() {
        this.itemForm = this.fb.group({
            region: new FormControl(undefined),
        });
    }

    generate() {
        if (this.itemForm.invalid)
            return;

            this.reporteGestionEfectivoAgencia.region = this.f.region.value;

              console.log("REGION222222   ", this.reporteGestionEfectivoAgencia.region);          
            this.updateData(this.reporteGestionEfectivoAgencia);     
           
            this.reporteGestionEfectivoAgenciaService.taquillaOperativa(this.reporteGestionEfectivoAgencia).subscribe(data => {                                   
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
    }
}
