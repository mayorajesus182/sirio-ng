import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {BehaviorSubject, concat} from 'rxjs';
import { GlobalConstants } from 'src/@sirio/constants';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { TipoRelacion, TipoRelacionService } from 'src/@sirio/domain/services/configuracion/persona-juridica/tipo-relacion.service';
import { TipoDocumento, TipoDocumentoService } from 'src/@sirio/domain/services/configuracion/tipo-documento.service';
import { EmpresaRelacionada, EmpresaRelacionadaService } from 'src/@sirio/domain/services/persona/empresa-relacionada/empresa-relacionada.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-informacion-laboral-form.popup',
  templateUrl: './empresa-relacionada-form.popup.component.html',
  styleUrls: ['./empresa-relacionada-form.popup.component.scss']
})

export class EmpresaRelacionadaFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  empresaRelacionada: EmpresaRelacionada = {} as EmpresaRelacionada;

  public tipoRelacionList = new BehaviorSubject<TipoRelacion[]>([]);

  public tipodocumentoList = new BehaviorSubject<TipoDocumento[]>([]);

  referencias = [];
  tipoDocumento = undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<EmpresaRelacionadaFormPopupComponent>,

    private empresaRelacionadaService: EmpresaRelacionadaService,    
    private tipoDocumentoService: TipoDocumentoService,    
    private tipoRelacionService: TipoRelacionService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {
   
  }

  ngOnInit() {

    this.referencias = this.defaults.payload.referencias;
    this.tipoDocumento =this.defaults.payload.Tipopersona.tipoDocumento+this.defaults.payload.Tipopersona.identificacion ;
    console.log(this.tipoDocumento)
    if (GlobalConstants.TIPO_PERSONA == 'J') {
      this.tipoRelacionService.actives().subscribe(data => {
        this.tipoRelacionList.next(data);
        this.cdr.detectChanges();
      })

    } else {
      this.tipoRelacionService.activesForNatural().subscribe(data => {
        this.tipoRelacionList.next(data);
        this.cdr.detectChanges();
      })        
    }

    this.tipoDocumentoService.actives().subscribe(data => {
      this.tipodocumentoList.next(data);
      this.cdr.detectChanges();
    })

    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      this.empresaRelacionadaService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.empresaRelacionada = data;
        this.buildForm();
        this.loadingDataForm.next(false);
       
      })
    } else {
      this.empresaRelacionada = {} as EmpresaRelacionada;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }
  
  buildForm() {
//validar carcteres especiales
    this.itemForm = this.fb.group({      
      relacionEmpresa: new FormControl(this.empresaRelacionada.relacionEmpresa || undefined, [Validators.required]),
      empresa: new FormControl(this.empresaRelacionada.empresa || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      direccion: new FormControl(this.empresaRelacionada.direccion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
      tipoDocumento: new FormControl(this.empresaRelacionada.tipoDocumento || undefined, [Validators.required]),
      identificacion: new FormControl(this.empresaRelacionada.identificacion || undefined, [Validators.required, Validators.pattern(RegularExpConstants.NUMERIC)])
    });


    this.cdr.detectChanges();

    this.f.identificacion.valueChanges.subscribe(val => {
      if (val) {
        if (!this.validateReferencias(this.f.tipoDocumento ? this.f.tipoDocumento.value : undefined, this.f.identificacion ? this.f.identificacion.value : undefined)) {
          this.f.identificacion.setErrors({ exists: true });
          this.f.identificacion.markAsDirty();
          this.cdr.detectChanges();
        }

        if (!this.validateTitular(this.tipoDocumento ? this.f.tipoDocumento.value : undefined, this.f.identificacion ? this.f.identificacion.value : undefined)) {
          this.f.identificacion.setErrors({ exists2: true });
          this.f.identificacion.markAsDirty();
          this.cdr.detectChanges();
        }
      }

    });

  }

  validateReferencias(tipoDocumento: string, identificacion: string) {
    if (!identificacion) {
      return true;
    }
    this.cdr.detectChanges();

    console.log(tipoDocumento);

    console.log(identificacion);

    console.log(this.referencias);

    return this.referencias.find(num => num === tipoDocumento + '-' + identificacion) == undefined;
  }



  validateTitular(tipoDocumento: string, identificacion: string) {
    if (!identificacion) {
      return true;
    }
    console.log(identificacion);
    this.cdr.detectChanges();
    if( this.tipoDocumento === tipoDocumento + identificacion){
      return false
    }
    return true
  }



  save() {
    
    this.updateData(this.empresaRelacionada);// aca actualizamos Empresas Relacionadas
    this.empresaRelacionada.persona=this.defaults.payload.persona;
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.empresaRelacionadaService,this.empresaRelacionada,'EmpresaRelacionada',this.empresaRelacionada.id==undefined);
  }
}
