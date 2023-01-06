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
    gestionEfectivoReports: GestionEfectivoReports = {} as GestionEfectivoReports;
    esGteRegional: Boolean = false;
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private gestionEfectivoReportsService: GestionEfectivoReportsService,
        private regionService: RegionService,
        private sessionService: SessionService,
        private rolService: RolService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        const user = this.sessionService.getUser() as User;
        this.esGteRegional = user.rols.includes(RolConstants.GERENTE_REGIONAL);
        this.buildForm();

        this.regionService.actives().subscribe(data => {
            this.regiones.next(data);
        });
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

        this.updateData(this.gestionEfectivoReports);
        this.loadingDataForm.next(true);
        this.gestionEfectivoReportsService.taquillaOperativa(this.gestionEfectivoReports).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
        this.itemForm.reset({});
    }
}
