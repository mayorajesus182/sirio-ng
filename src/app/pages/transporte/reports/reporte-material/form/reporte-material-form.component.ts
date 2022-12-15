import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ReporteTransportista, ReporteTransportistaService } from 'src/@sirio/domain/services/transporte/reports/reporte-transportista.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';

@Component({
    selector: 'app-reporte-material-form',
    templateUrl: './reporte-material-form.component.html',
    styleUrls: ['./reporte-material-form.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class ReporteMaterialFormComponent extends FormBaseComponent{

    reporteTransportista: ReporteTransportista = {} as ReporteTransportista;

    constructor(
        injector: Injector,
        private reporteTransportistaService: ReporteTransportistaService) {
        super(undefined, injector);
    }

    generate() {
        this.loadingDataForm.next(true);
        this.reporteTransportistaService.materialTransportista().subscribe(data => {
            this.loadingDataForm.next(false);
            const name = this.getFileName(data);
            let blob: any = new Blob([data.body], { type: 'application/octet-stream' });
            this.download(name, blob);
        });
    }
}
