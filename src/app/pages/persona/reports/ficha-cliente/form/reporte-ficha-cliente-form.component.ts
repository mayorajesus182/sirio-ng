import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { RolConstants } from 'src/@sirio/constants';
import { Region, RegionService } from 'src/@sirio/domain/services/configuracion/gestion-efectivo/region.service';
import { PersonaReport, PersonaReportService } from 'src/@sirio/domain/services/persona/persona-report.service';
import { Persona, PersonaService } from 'src/@sirio/domain/services/persona/persona.service';
import { User } from 'src/@sirio/domain/services/security/auth.service';
import { SessionService } from 'src/@sirio/services/session.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-ficha-cliente-form',
    templateUrl: './reporte-ficha-cliente-form.component.html',
    styleUrls: ['./reporte-ficha-cliente-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteFichaClienteFormComponent extends FormBaseComponent implements OnInit {
    personaReport: PersonaReport = {} as PersonaReport;
    persona: Persona = {} as Persona;
    loading = new BehaviorSubject<boolean>(false);
    constructor(
        injector: Injector,
        dialog: MatDialog,
        private personaReportService: PersonaReportService,
        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() { }

    queryResult(event) {   
        this.loading.next(false);
        if (!event.id && !event.numper) {
            this.loaded$.next(false);
            this.persona = {} as Persona;
            this.cdr.detectChanges();
        } else {
            this.persona = event;
            this.loading.next(true);
        }
    }
    generate() {
        this.loadingDataForm.next(true);
        this.personaReportService.ficha(this.personaReport.id || this.persona.id).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
    }
}





