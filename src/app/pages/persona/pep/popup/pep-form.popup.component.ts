import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

import { Pep, PepService } from 'src/@sirio/domain/services/persona/pep/pep.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';

@Component({
  selector: 'sirio-pep-form.popup',
  templateUrl: './pep-form.popup.component.html',
  styleUrls: ['./pep-form.popup.component.scss']
})

export class PepFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  pep: Pep = {} as Pep;
  
  public tipPep = new BehaviorSubject<TipPep[]>([]);
  public nombre = new BehaviorSubject<Nombre[]>([]);
  public ente = new BehaviorSubject<Ente[]>([]);
  public cargo = new BehaviorSubject<Cargo[]>([]);
  public pais = new BehaviorSubject<Pais[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<PepFormPopupComponent>,
    private pepService: PepService,

    private tipPepService: TipPepService,
    private nombreService: NombreService,
    private enteService: EnteService,
    private cargoService: CargoService,
    private paisService: Pais,

    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }
  ngAfterViewInit(): void {
    // // esto se utiliza en modo edición
    // if (this.f.estado.value) {

    //   this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
    //     this.municipios.next(data);
    //     this.cdr.detectChanges();
    //   });
    // }

    // if (this.f.municipio.value) {
    //   this.parroquiaService.activesByMunicipio(this.f.municipio.value).subscribe(data => {
    //     this.parroquias.next(data);
    //     this.cdr.detectChanges();
    //   });
    // }

    // if (this.f.parroquia.value) {
    //   this.zonaPostalService.activesByParroquia(this.f.parroquia.value).subscribe(data => {
    //     this.zonasPostales.next(data);
    //     this.cdr.detectChanges();
    //   });
    // }
  }

  ngOnInit() {

    console.log(this.defaults);

    if (this.defaults.id) {
      this.mode = 'global.edit';
      this.pep = this.defaults.payload;
    } else {
      this.pep = {} as Pep;
    }
   
    this.tipPepService.actives().subscribe(data => {
      this.tipPep.next(data);
      this.cdr.detectChanges();
    })
        
    this.nombreService.activesByPaisInstitucion().subscribe(data => {
      this.nombre.next(data);
      this.cdr.detectChanges();
    });
    
    this.enteService.actives().subscribe(data => {
      this.ente.next(data);
      this.cdr.detectChanges();
    });
    
    this.cargoService.actives().subscribe(data => {
      this.cargo.next(data);
      this.cdr.detectChanges();
    });
    
    this.paisService.actives().subscribe(data => {
      this.pais.next(data);
      this.cdr.detectChanges();
    });
    
    // this.itemForm = this.fb.group({
    //   tipoDireccion: new FormControl(this.direccion.tipoDireccion || '', [Validators.required]),
    //   parroquia: new FormControl(this.direccion.parroquia || '', [Validators.required]),
    //   estado: new FormControl(this.direccion.estado || '', [Validators.required]),
    //   municipio: new FormControl(this.direccion.municipio || '', [Validators.required]),
    //   zonaPostal: new FormControl(this.direccion.zonaPostal || '', [Validators.required]),
    //   via: new FormControl(this.direccion.via || '', [Validators.required]),
    //   nucleo: new FormControl(this.direccion.nucleo || '', [Validators.required]),
    //   construccion: new FormControl(this.direccion.nucleo || '', [Validators.required]),
    //   referencia: new FormControl(this.direccion.nucleo || '', [Validators.required,Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)])
    // });

    // this.f.estado.valueChanges.subscribe(value => {
    //   this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
    //     this.municipios.next(data);
    //     this.cdr.detectChanges();
    //   });
    // });

    // this.f.municipio.valueChanges.subscribe(value => {
    //   this.parroquiaService.activesByMunicipio(this.f.municipio.value).subscribe(data => {
    //     this.parroquias.next(data);
    //     this.cdr.detectChanges();
    //   });
    // });

    // this.f.parroquia.valueChanges.subscribe(value => {
    //   this.zonaPostalService.activesByParroquia(value).subscribe(data => {
    //     this.zonasPostales.next(data);
    //     this.cdr.detectChanges();
    //   });
    // });

    this.cdr.detectChanges();

  }

  save() {

    console.log('mode ', this.mode);
    this.updateData(this.pep);// aca actualizamos la direccion
    this.pep.persona=this.defaults.payload.persona;
    console.log(this.pepService);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.pepService,this.pep,'La Dirección',this.pep.id==undefined);

    // this.dialogRef.close();

  }
}