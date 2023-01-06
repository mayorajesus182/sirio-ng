import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TransportistaReports, TransportistaReportsService } from 'src/@sirio/domain/services/transporte/reports/transportista-reports.service';
import { Transportista, TransportistaService } from 'src/@sirio/domain/services/transporte/transportista.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-costo-material-form',
    templateUrl: './reporte-costo-material-form.component.html',
    styleUrls: ['./reporte-costo-material-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteCostoMaterialFormComponent extends FormBaseComponent implements OnInit {

    public transportistas = new BehaviorSubject<Transportista[]>([]);
    transportistaReports: TransportistaReports = {} as TransportistaReports;

    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private transportistaReportsService: TransportistaReportsService,
        private transportistaService: TransportistaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        this.buildForm();
        this.transportistaService.actives().subscribe(data => {
            this.transportistas.next(data);
        });
    }

    buildForm() {
        this.itemForm = this.fb.group({
            transportista: new FormControl(undefined),
        });
    }

    generate() {
        if (this.itemForm.invalid)
            return;
        this.updateData(this.transportistaReports);
        this.loadingDataForm.next(true);
        this.transportistaReportsService.costoMaterialTransportista(this.transportistaReports).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
        this.itemForm.reset({});
    }
}
