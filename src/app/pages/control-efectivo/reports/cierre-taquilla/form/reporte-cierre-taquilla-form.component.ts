import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { RolConstants } from 'src/@sirio/constants';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { GestionEfectivoReports, GestionEfectivoReportsService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/gestion-efectivo-reports.service';
import { Taquilla, TaquillaService } from 'src/@sirio/domain/services/organizacion/taquilla.service';
import { User } from 'src/@sirio/domain/services/security/auth.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';

@Component({
    selector: 'app-reporte-cierre-taquilla-form',
    templateUrl: './reporte-cierre-taquilla-form.component.html',
    styleUrls: ['./reporte-cierre-taquilla-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteCierreTaquillaFormComponent extends FormBaseComponent implements OnInit {
    esOperadorTaquilla: Boolean = false;
    preferencia: any;
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public taquillas = new BehaviorSubject<Taquilla[]>([]);
    gestionEfectivoReports: GestionEfectivoReports = {} as GestionEfectivoReports;
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private gestionEfectivoReportsService: GestionEfectivoReportsService,
        private preferenciaService: PreferenciaService,
        private sessionService: SessionService,
        private monedaService: MonedaService,
        private taquillaService: TaquillaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {

        this.preferenciaService.parametros().subscribe(data => {
            this.preferencia = data;
            this.buildForm();
            const user = this.sessionService.getUser() as User;
            this.esOperadorTaquilla = user.rols.includes(RolConstants.OPERADOR_TAQUILLA);
        });
   
        this.cdr.detectChanges();
        this.taquillaService.actives().subscribe(data => {            
            this.taquillas.next(data);
        });

        this.monedaService.paraOperacionesActives().subscribe(data => {
            this.monedas.next(data);
        });
    }

    buildForm() {
        this.itemForm = this.fb.group({
            moneda: new FormControl(this.preferencia.monedaConoActual.value),
            taquilla: new FormControl(undefined),
        });
    }

    generate() {
        if (this.itemForm.invalid)
            return;
        this.updateData(this.gestionEfectivoReports);
        this.loadingDataForm.next(true);
        this.gestionEfectivoReportsService.cierreTaquilla(this.gestionEfectivoReports).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
        this.itemForm.reset({});
    }
}
