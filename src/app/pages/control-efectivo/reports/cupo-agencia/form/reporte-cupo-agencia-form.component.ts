import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Region, RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { ReporteGestionEfectivoAgencia, ReporteGestionEfectivoAgenciaService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/reports-gestion-efectivo-agencia.service';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-cupo-agencia-form',
    templateUrl: './reporte-cupo-agencia-form.component.html',
    styleUrls: ['./reporte-cupo-agencia-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteCupoAgenciaFormComponent extends FormBaseComponent implements OnInit {

    public regiones = new BehaviorSubject<Region[]>([]);
    public agencias = new BehaviorSubject<Agencia[]>([]);

    reporteGestionEfectivoAgencia: ReporteGestionEfectivoAgencia = {} as ReporteGestionEfectivoAgencia;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private reporteGestionEfectivoAgenciaService: ReporteGestionEfectivoAgenciaService,
        private regionService: RegionService,
        private agenciaService: AgenciaService,
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
            region: new FormControl({ value: this.reporteGestionEfectivoAgencia.region || undefined }, [Validators.required]),
            agencia: new FormControl({ value: this.reporteGestionEfectivoAgencia.agencia|| undefined }, [Validators.required]),
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
        this.updateData(this.reporteGestionEfectivoAgencia);
        this.loadingDataForm.next(true);
        this.reporteGestionEfectivoAgenciaService.cupoAgencia(this.reporteGestionEfectivoAgencia).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
        this.itemForm.reset({});
    }
}
