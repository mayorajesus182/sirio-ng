import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RolConstants } from 'src/@sirio/constants';
import { Moneda, MonedaService } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { GestionEfectivoReports, GestionEfectivoReportsService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/reports/gestion-efectivo-reports.service';
import { Agencia, AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { Preferencia, PreferenciaService } from 'src/@sirio/domain/services/preferencias/preferencia.service';
import { User } from 'src/@sirio/domain/services/security/auth.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-cierre-agencia-form',
    templateUrl: './reporte-cierre-agencia-form.component.html',
    styleUrls: ['./reporte-cierre-agencia-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteCierreAgenciaFormComponent extends FormBaseComponent implements OnInit {
    esOperadorAgencia: Boolean = false;
    preferencia: Preferencia;
    public monedas = new BehaviorSubject<Moneda[]>([]);
    public agencias = new BehaviorSubject<Agencia[]>([]);
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
        private agenciaService: AgenciaService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        this.preferenciaService.active().subscribe(data => {
            this.preferencia = data;
            this.buildForm();
            const user = this.sessionService.getUser() as User;
            this.esOperadorAgencia = user.rols.includes(RolConstants.GERENTE_TESORERO_AGENCIA);
        });
   
        this.cdr.detectChanges();
        this.agenciaService.actives().subscribe(data => {
            this.agencias.next(data);
        });

        this.monedaService.paraOperacionesActives().subscribe(data => {
            this.monedas.next(data);
        });
    }

    buildForm() {
        this.itemForm = this.fb.group({
            moneda: new FormControl(this.preferencia.monedaConoActual.value),
            agencia: new FormControl(undefined),
        });
    }

    generate() {
        if (this.itemForm.invalid)
            return;
        this.updateData(this.gestionEfectivoReports);
        this.loadingDataForm.next(true);
        this.gestionEfectivoReportsService.cierreAgencia(this.gestionEfectivoReports).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
        this.itemForm.reset({});
    }
}
