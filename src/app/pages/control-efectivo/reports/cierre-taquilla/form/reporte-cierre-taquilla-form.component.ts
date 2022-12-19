import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { ReporteGestionEfectivoTaquilla, ReporteGestionEfectivoTaquillaService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/reports-gestion-efectivo-taquilla.service';
import { Taquilla, TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-cierre-taquilla-form',
    templateUrl: './reporte-cierre-taquilla-form.component.html',
    styleUrls: ['./reporte-cierre-taquilla-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteCierreTaquillaFormComponent extends FormBaseComponent implements OnInit {

    public monedas = new BehaviorSubject<Moneda[]>([]);
    public taquillas = new BehaviorSubject<Taquilla[]>([]);
    reporteGestionEfectivoTaquilla: ReporteGestionEfectivoTaquilla = {} as ReporteGestionEfectivoTaquilla;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private reporteGestionEfectivoTaquillaService: ReporteGestionEfectivoTaquillaService,
        private monedaService: MonedaService,
        private taquillaService: TaquillaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        this.buildForm();
        this.taquillaService.actives().subscribe(data => {
            this.taquillas.next(data);
        });

        // this.monedaService.actives().subscribe(data => {
        //     this.monedas.next(data);
        // });

        this.monedaService.fisicaActives().subscribe(data => {
            this.monedas.next(data);
        });
    }

    buildForm() {
        this.itemForm = this.fb.group({
            moneda: new FormControl({ value: this.reporteGestionEfectivoTaquilla.moneda || undefined }, [Validators.required]),
            taquilla: new FormControl({ value: this.reporteGestionEfectivoTaquilla.taquilla|| undefined }, [Validators.required]),
        });
    }

    generate() {
        if (this.itemForm.invalid)
            return;
        this.updateData(this.reporteGestionEfectivoTaquilla);
        this.loadingDataForm.next(true);
        this.reporteGestionEfectivoTaquillaService.cierreTaquilla(this.reporteGestionEfectivoTaquilla).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
        this.itemForm.reset({});
    }
}
