import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
//import { TipoRelacion, TipoRelacionService } from 'src/@sirio/domain/services/configuracion/persona-juridica/tipo-relacion.service';
import { RegistroMercantil, RegistroMercantilService } from 'src/@sirio/domain/services/persona/registro-mercantil/registro-mercantil.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-registro-mercantil-form.popup',
  templateUrl: './registro-mercantil-form.popup.component.html',
  styleUrls: ['./registro-mercantil-form.popup.component.scss']
})

export class RegistroMercantilFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  registroMercantil: RegistroMercantil = {} as RegistroMercantil;
  
  //public tipoRelacionList = new BehaviorSubject<TipoRelacion[]>([]);

  
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<RegistroMercantilFormPopupComponent>,

    private registroMercantilService: RegistroMercantilService,        
   // private tipoRelacionService: TipoRelacionService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {
   
  }

  ngOnInit() {

    
    // this.tipoRelacionService.actives().subscribe(data => {
    //   console.log(data);
      
    //   this.tipoRelacionList.next(data);
    //   this.cdr.detectChanges();
    // })

   
    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      this.registroMercantilService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.registroMercantil = data;
        this.buildForm();
        this.loadingDataForm.next(false);
       
      })
    } else {
      this.registroMercantil = {} as RegistroMercantil;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }
  
  buildForm() {
//validar carcteres especiales
    this.itemForm = this.fb.group({
      nombre: new FormControl(this.registroMercantil.nombre || undefined, [Validators.required]),
      numero: new FormControl(this.registroMercantil.numero || undefined, [Validators.required]),
      tomo: new FormControl(this.registroMercantil.tomo || undefined, [Validators.required]),
      folio: new FormControl(this.registroMercantil.folio || undefined, [Validators.required]),
      capitalSocial: new FormControl(this.registroMercantil.capitalSocial || undefined, [Validators.required]),
      gaceta: new FormControl(this.registroMercantil.gaceta || undefined, [Validators.required]),
      decreto: new FormControl(this.registroMercantil.decreto || undefined, [Validators.required]),
      fecha: new FormControl(this.registroMercantil.fecha ? moment(this.registroMercantil.fecha, 'DD/MM/YYYY') : ''),
      codigoOnt: new FormControl(this.registroMercantil.codigoOnt || undefined, [Validators.required]),
    });


    this.cdr.detectChanges();
  }

  save() {
    
    console.log('mode ', this.mode);
    this.updateData(this.registroMercantil);// aca actualizamos Empresas Relacionadas
    this.registroMercantil.persona=this.defaults.payload.persona;

    this.registroMercantil.fecha = this.registroMercantil.fecha ? this.registroMercantil.fecha.format('DD/MM/YYYY') : '';
    console.log(this.registroMercantil);
    
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.registroMercantilService,this.registroMercantil,'RegistroMercantil',this.registroMercantil.id==undefined);
    console.log(this.registroMercantil);
    console.log(this.registroMercantilService);
  }
}