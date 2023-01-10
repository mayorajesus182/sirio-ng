import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { GlobalConstants } from 'src/@sirio/constants';
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

  
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<RegistroMercantilFormPopupComponent>,

    private calendarioService: CalendarioService,
    
    private registroMercantilService: RegistroMercantilService,        
   // private tipoRelacionService: TipoRelacionService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {
   
  }

  ngOnInit() {

    console.log('this.defaults.payload    ', this.defaults.payload);

    this.esGobierno = (this.defaults.payload.tipoDocumento === GlobalConstants.TIPDOC_GOBIERNO);

    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      
      this.registroMercantilService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.add';


        this.registroMercantil = data;
        this.registroMercantil.id =undefined;
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
//validar carcteres especiales
    this.itemForm = this.fb.group({
      nombre: new FormControl(this.registroMercantil.nombre || undefined),
      folio: new FormControl(this.registroMercantil.folio || undefined),
      numero: new FormControl(this.registroMercantil.numero || undefined),
      fecha: new FormControl(this.registroMercantil.fecha ? moment(this.registroMercantil.fecha, 'DD/MM/YYYY') : ''),
      tomo: new FormControl(this.registroMercantil.tomo || undefined),
      capitalSocial: new FormControl(this.registroMercantil.capitalSocial || undefined),
      gaceta: new FormControl(this.registroMercantil.gaceta || undefined),
      decreto: new FormControl(this.registroMercantil.decreto || undefined),
      codigoOnt: new FormControl(this.registroMercantil.codigoOnt || undefined),
    });


    this.cdr.detectChanges();
  }

  save() {
    
    console.log('mode ', this.mode);
    this.updateData(this.registroMercantil);// aca actualizamos Empresas Relacionadas
    if(!this.registroMercantil.persona){
      this.registroMercantil.persona=this.defaults.payload.persona;

    }

    this.registroMercantil.fecha = this.registroMercantil.fecha ? this.registroMercantil.fecha.format('DD/MM/YYYY') : '';
    console.log(this.registroMercantil);
    
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.registroMercantilService,this.registroMercantil,'RegistroMercantil',this.registroMercantil.id==undefined);
    console.log(this.registroMercantil);
    console.log(this.registroMercantilService);
  }

}