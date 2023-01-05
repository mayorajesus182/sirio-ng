import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TransportistaReports, TransportistaReportsService } from 'src/@sirio/domain/services/transporte/reports/transportista-reports.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-empresa-form',
    templateUrl: './reporte-empresa-form.component.html',
    styleUrls: ['./reporte-empresa-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteEmpresaFormComponent extends FormBaseComponent {

    transportistaReports: TransportistaReports = {} as TransportistaReports;

    constructor(
        injector: Injector,
        private transportistaReportsService: TransportistaReportsService) {
        super(undefined, injector);
    }

    generate() {
        this.loadingDataForm.next(true);
        this.transportistaReportsService.empresaTransportista().subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
    }
}
