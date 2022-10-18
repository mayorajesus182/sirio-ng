import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Pais, PaisService } from 'src/@sirio/domain/services/configuracion/localizacion/pais.service';
import { TipoPep, TipoPepService } from 'src/@sirio/domain/services/configuracion/persona-natural/tipo-pep.service';
import { Pep, PepService } from 'src/@sirio/domain/services/persona/pep/pep.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-pep-form.popup',
  templateUrl: './pep-form.popup.component.html',
  styleUrls: ['./pep-form.popup.component.scss']
})

export class PepFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  pep: Pep = {} as Pep;
  
  public tipoPepList = new BehaviorSubject<TipoPep[]>([]);
  public paisList = new BehaviorSubject<Pais[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<PepFormPopupComponent>,
    private pepService: PepService,
    private tipoPepService: TipoPepService,
    private paisService: PaisService,

    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }

  ngAfterViewInit(): void {
   
  }

  ngOnInit() {


    this.tipoPepService.actives().subscribe(data => {
      console.log(data);
      
      this.tipoPepList.next(data);
      this.cdr.detectChanges();
    })
   

    this.paisService.actives().subscribe(data => {
      console.log(data);
      
      this.paisList.next(data);
      this.cdr.detectChanges();
    })
    
    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {
      this.pepService.get(this.defaults.payload.id).subscribe(data => {
        this.mode = 'global.edit';
        this.pep = data;
        this.buildForm();
        this.loadingDataForm.next(false);
       
      })
    } else {
      this.pep = {} as Pep;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }

  buildForm() {
//validar carcteres especiales
    this.itemForm = this.fb.group({
      //tipoPep: new FormControl(this.pep.tipoPep),
      tipoPep: new FormControl(this.pep.tipoPep || undefined, [Validators.required]),
      //nombre: new FormControl(this.pep.nombre),
      nombre: new FormControl(this.pep.nombre || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      //ente: new FormControl(this.pep.ente),
      ente: new FormControl(this.pep.ente || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      //cargo: new FormControl(this.pep.cargo),
      cargo: new FormControl(this.pep.cargo || '', [Validators.required, Validators.pattern(RegularExpConstants.ALPHA_ACCENTS_SPACE)]),
      //pais: new FormControl(this.pep.pais)
      pais: new FormControl(this.pep.pais || undefined, [Validators.required])
    });


    this.cdr.detectChanges();
  }

  save() {

    console.log('mode ', this.mode);
    this.updateData(this.pep);// aca actualizamos la direccion
    this.pep.persona=this.defaults.payload.persona;
    console.log(this.pep);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.pepService,this.pep,'PEP',this.pep.id==undefined);

  }
}