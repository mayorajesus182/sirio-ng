import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RegularExpConstants } from 'src/@sirio/constants/regularexp.constants';
import { TipoRelacion, TipoRelacionService } from 'src/@sirio/domain/services/configuracion/persona-juridica/tipo-relacion.service';
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

  
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<EmpresaRelacionadaFormPopupComponent>,

    private empresaRelacionadaService: EmpresaRelacionadaService,        
    private tipoRelacionService: TipoRelacionService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {
   
  }

  ngOnInit() {

    
    this.tipoRelacionService.actives().subscribe(data => {
      console.log(data);
      
      this.tipoRelacionList.next(data);
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
      empresa: new FormControl(this.empresaRelacionada.empresa || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      direccion: new FormControl(this.empresaRelacionada.direccion || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)])
    });


    this.cdr.detectChanges();
  }

  save() {
    
    console.log('mode ', this.mode);
    this.updateData(this.empresaRelacionada);// aca actualizamos Empresas Relacionadas
    this.empresaRelacionada.persona=this.defaults.payload.persona;
    console.log(this.empresaRelacionada);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.empresaRelacionadaService,this.empresaRelacionada,'EmpresaRelacionada',this.empresaRelacionada.id==undefined);
    console.log(this.empresaRelacionada);
    console.log(this.empresaRelacionadaService);
  }
}