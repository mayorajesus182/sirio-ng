import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
import { AtmReportService } from 'src/@sirio/domain/services/organizacion/atm.reports.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-atm-form',
    templateUrl: './reporte-atm-form.component.html',
    styleUrls: ['./reporte-atm-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteAtmFormComponent extends FormBaseComponent implements OnInit {

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private atmReportService: AtmReportService,
        private calendarioService: CalendarioService,       
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        }


    generate() {
        this.atmReportService.reporte().subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
    }
}
