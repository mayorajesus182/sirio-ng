import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { CuentaBanco, CuentaBancoService } from 'src/@sirio/domain/services/persona/cuenta-banco.service';
import { CuentaReport, CuentaReportService } from 'src/@sirio/domain/services/persona/cuenta-report.service';
import { Persona } from 'src/@sirio/domain/services/persona/persona.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-certificado-cuenta-form',
    templateUrl: './reporte-certificado-cuenta-form.component.html',
    styleUrls: ['./reporte-certificado-cuenta-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteCertificadoCuentaFormComponent extends FormBaseComponent implements OnInit {
    persona: Persona = {} as Persona;
    cuentaReport: CuentaReport = {} as CuentaReport;
    loading = new BehaviorSubject<boolean>(false);
    public CuentasBancos = new BehaviorSubject<CuentaBanco[]>([]);


    constructor(
        injector: Injector,
        dialog: MatDialog,
        private fb: FormBuilder,
        private cuentaReportService: CuentaReportService,
        private cuentaBancoService: CuentaBancoService,

        private cdr: ChangeDetectorRef) {
        super(undefined, injector);
    }

    ngOnInit() {
        this.itemForm = this.fb.group({
            id: new FormControl(undefined),
            cuentaBancaria: new FormControl(undefined)

        });
    }

    queryResult(event) {
        this.itemForm?this.itemForm.reset({}):'';
        this.f.cuentaBancaria.setValue(undefined);
        this.loading.next(false);
        if (!event.id && !event.numper) {
            this.persona = {} as Persona;
            this.loading.next(false)
            this.cdr.detectChanges();
        } else {
            this.loading.next(true);
            this.persona = event;

            this.cuentaBancoService.listByPersona(this.persona.id).subscribe(data => {
                console.log('cuentas bancarias', data);
                this.CuentasBancos.next(data);
                if (data.length === 1) {
                    this.f.cuentaBancaria.setValue(data[0].id);
                }
            });
        }
    }
    generate(row) {
        this.loadingDataForm.next(true);
        this.cuentaReportService.certificado(this.cuentaReport.id || row.id).subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
    }

    send(row) {
        this.swalService.show('¿Desea Enviar el Certificadod de la Cuenta por Correo Electrónico?',).then((resp) => {
            if (!resp.dismiss) {
                this.loadingDataForm.next(true);
                this.cuentaBancoService.send(this.cuentaReport.id || row.id).subscribe(data => {
                    this.successResponse('Operacion', 'aplicada', true);
                    this.loadingDataForm.next(false);
                    const name = this.getFileName(data);
                    let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
                    this.loading.next(true);
                }, err => {
                    this.loadingDataForm.next(false);
                    this.loading.next(false);
                });

            } else {
                this.loading.next(false);
            }
        });
    }
}





