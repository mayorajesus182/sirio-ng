import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Region, RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { GestionEfectivoReports, GestionEfectivoReportsService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/gestionEfectivoReports.service';
import { ReporteGestionEfectivoAgencia, ReporteGestionEfectivoAgenciaService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/reports-gestion-efectivo-agencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-agencia-operativa-form',
    templateUrl: './reporte-agencia-operativa-form.component.html',
    styleUrls: ['./reporte-agencia-operativa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteAgenciaOperativaFormComponent extends FormBaseComponent implements OnInit {

    public regiones = new BehaviorSubject<Region[]>([]);
    gestionEfectivoReports: GestionEfectivoReports = {} as GestionEfectivoReports;
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private gestionEfectivoReportsService: GestionEfectivoReportsService,
        private regionService: RegionService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        this.buildForm();
        this.regionService.actives().subscribe(data => {
            this.regiones.next(data);
        });
    }

    buildForm() {
        this.itemForm = this.fb.group({
            region: new FormControl(undefined),
        });
    }

    generate() {
        if (this.itemForm.invalid)
            return;
        this.updateData(this.gestionEfectivoReports);
        this.loadingDataForm.next(true);
        this.gestionEfectivoReportsService.agenciaOperativa(this.gestionEfectivoReports).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
    }
}
