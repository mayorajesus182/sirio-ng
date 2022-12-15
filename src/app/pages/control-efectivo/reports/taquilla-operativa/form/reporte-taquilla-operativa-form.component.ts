import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Region, RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { ReporteGestionEfectivo, ReporteGestionEfectivoService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/reports-gestion-efectivo.service';
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
    reporteGestionEfectivo: ReporteGestionEfectivo = {} as ReporteGestionEfectivo;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private reporteGestionEfectivoService: ReporteGestionEfectivoService,
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
            region: new FormControl({ value: this.reporteGestionEfectivo.region || undefined }, [Validators.required]),
        });
    }

    generate() {
        if (this.itemForm.invalid)
            return;
        this.updateData(this.reporteGestionEfectivo);
        this.loadingDataForm.next(true);
        this.reporteGestionEfectivoService.taquillaOperativa(this.reporteGestionEfectivo).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
    }
}
