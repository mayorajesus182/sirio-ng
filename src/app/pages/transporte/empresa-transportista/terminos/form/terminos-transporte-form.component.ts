import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { TerminoTransporte, TerminoTransporteService } from 'src/@sirio/domain/services/transporte/terminos/termino-transporte.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';




@Component({
  selector: 'app-terminos-transporte-form',
  templateUrl: './terminos-transporte-form.component.html',
  styleUrls: ['./terminos-transporte-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class TerminosTransporteFormComponent extends FormBaseComponent implements OnInit {

  terminoTransporte: TerminoTransporte = {} as TerminoTransporte;
  transportistaId: string;
  transportista: string;
  condicion: string;

  constructor(
    injector: Injector,
    dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private terminoTransporteService: TerminoTransporteService,
    private cdr: ChangeDetectorRef) {
    super(undefined, injector);
  }

  ngOnInit() {

    this.transportistaId = this.route.snapshot.params['id'];
    this.loadingDataForm.next(true);
    const data = history.state.data;

    if (data) {
      this.transportista = data.nombre;
      sessionStorage.setItem('trans_nombre', data.nombre);
    } else {
      this.transportista = sessionStorage.getItem('trans_nombre')
    }

    this.terminoTransporteService.get(this.transportistaId).subscribe((ttr: TerminoTransporte) => {
      this.terminoTransporte = ttr;
      this.condicion = this.terminoTransporte.condicion;
      this.isNew = false;
      this.cdr.detectChanges();
    }, error => {

      if (error.status == 404) {
        this.terminoTransporte.id = this.transportistaId;
        this.isNew = true;
      }
    });
    this.loadingDataForm.next(false);
  }

  save() {

    if (this.condicion == '' || this.condicion == null)
      return;

    this.terminoTransporte.condicion = this.condicion;

    if (this.isNew) {

      this.terminoTransporteService.save(this.terminoTransporte).subscribe(data => {
        this.successResponse('Los Términos y Condiciones', 'creados', false);
        return data;
      }, error => this.errorResponse(true));

    } else {

      this.terminoTransporteService.update(this.terminoTransporte).subscribe(data => {
        this.successResponse('Los Términos y Condiciones', 'actualizados', false);
        return data;
      }, error => this.errorResponse(true));
    }
  }

}

