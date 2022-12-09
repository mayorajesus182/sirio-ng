import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { MaterialTransporte, MaterialTransporteService } from 'src/@sirio/domain/services/transporte/materiales/material-transporte.service';
import { TerminoTransporte, TerminoTransporteService } from 'src/@sirio/domain/services/transporte/terminos/termino-transporte.service';
import { FormBaseComponent } from 'src/@sirio/shared/base/form-base.component';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';




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
      this.buildForm();
      this.loadingDataForm.next(false);
      this.cdr.detectChanges();
  });

  }


  buildForm() {
    this.itemForm = this.fb.group({
        condicion: new FormControl(this.terminoTransporte.condicion || '', [Validators.required]),
    });

}

  save() {
    if (this.itemForm.invalid)
        return;

    // this.updateData(this.transportista);
    // this.transportista.esCentroAcopio = this.transportista.esCentroAcopio ? 1 : 0
    // console.log(this.transportista);

    // this.saveOrUpdate(this.transportistaService, this.transportista, 'El Transportista', this.isNew);
}


}

