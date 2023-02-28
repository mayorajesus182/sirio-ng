import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { GlobalConstants, RegularExpConstants } from 'src/@sirio/constants';
import { CalendarioService } from 'src/@sirio/domain/services/calendario/calendar.service';
//import { TipoRelacion, TipoRelacionService } from 'src/@sirio/domain/services/configuracion/persona-juridica/tipo-relacion.service';
import { RegistroMercantil, RegistroMercantilService } from 'src/@sirio/domain/services/persona/registro-mercantil/registro-mercantil.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-registro-mercantil-form.popup',
  templateUrl: './registro-mercantil-form.popup.component.html',
  styleUrls: ['./registro-mercantil-form.popup.component.scss']
})

export class RegistroMercantilFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  todayValue: moment.Moment;
  registroMercantil: RegistroMercantil = {} as RegistroMercantil;
  esGobierno: boolean = false;
  ultimaModificacion: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<RegistroMercantilFormPopupComponent>,
    private calendarioService: CalendarioService,
    private registroMercantilService: RegistroMercantilService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {
    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {

    this.esGobierno = (this.defaults.payload.tipoDocumento === GlobalConstants.TIPDOC_GOBIERNO);
    this.ultimaModificacion = this.defaults.payload.ultimaModificacion;

    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      this.registroMercantilService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.add';
        this.registroMercantil = data;
        this.registroMercantil.id = undefined;
        this.buildForm();
        this.loadingDataForm.next(false);

      })
    } else {
      this.registroMercantil = {} as RegistroMercantil;
      this.buildForm();
      this.loadingDataForm.next(false);
    }

    this.calendarioService.today().subscribe(data => {
      this.todayValue = moment(data.today, GlobalConstants.DATE_SHORT);
    });
  }


  buildForm() {
    this.itemForm = this.fb.group({
      nombre: new FormControl(this.registroMercantil.nombre || undefined, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)),
      folio: new FormControl(this.registroMercantil.folio || undefined, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)),
      numero: new FormControl(this.registroMercantil.numero || undefined, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)),
      fecha: new FormControl(this.registroMercantil.fecha ? moment(this.registroMercantil.fecha, 'DD/MM/YYYY') : ''),
      tomo: new FormControl(this.registroMercantil.tomo || undefined, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)),
      capitalSocial: new FormControl(this.registroMercantil.capitalSocial || undefined),
      ente: new FormControl(this.registroMercantil.ente || undefined, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_ACCENTS_CHARACTERS_SPACE)),
      gaceta: new FormControl(this.registroMercantil.gaceta || undefined, Validators.pattern(RegularExpConstants.NUMERIC_POINT)),
      decreto: new FormControl(this.registroMercantil.decreto || undefined, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)),
      codigoOnt: new FormControl(this.registroMercantil.codigoOnt || undefined, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS)),
    });
    this.cdr.detectChanges();
  }

  save() {
    this.updateData(this.registroMercantil);// aca actualizamos Empresas Relacionadas
    if (!this.registroMercantil.persona) {
      this.registroMercantil.persona = this.defaults.payload.persona;
    }

    this.registroMercantil.fecha = this.registroMercantil.fecha ? this.registroMercantil.fecha.format('DD/MM/YYYY') : '';
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.registroMercantilService, this.registroMercantil, 'RegistroMercantil', this.registroMercantil.id == undefined);
  }
}
