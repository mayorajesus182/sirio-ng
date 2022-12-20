import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { TipoFirma, TipoFirmaService } from 'src/@sirio/domain/services/configuracion/producto/tipo-firma.service';
import { TipoFirmante, TipoFirmanteService } from 'src/@sirio/domain/services/configuracion/producto/tipo-firmante.service';
import { TipoParticipacion, TipoParticipacionService } from 'src/@sirio/domain/services/configuracion/producto/tipo-participacion.service';
import { Interviniente, IntervinienteService } from 'src/@sirio/domain/services/persona/interviniente/interviniente.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-interviniente-form.popup',
  templateUrl: './interviniente-form.popup.component.html',
  styleUrls: ['./interviniente-form.popup.component.scss']
})
export class IntervinienteFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  interviniente: Interviniente = {} as Interviniente;
  principal: boolean=false;

  public tipoParticipaciones = new BehaviorSubject<TipoParticipacion[]>([]);
  public tipoFirmas = new BehaviorSubject<TipoFirma[]>([]);
  public tipoFirmantes = new BehaviorSubject<TipoFirmante[]>([]);
  
  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<IntervinienteFormPopupComponent>,
    private intervinienteService: IntervinienteService,
    private tipoParticipacionService: TipoParticipacionService,
    private tipoFirmaService: TipoFirmaService,
    private tipoFirmanteService: TipoFirmanteService,

    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }
  ngAfterViewInit(): void {
    // esto se utiliza en modo edición

    this.loading$.subscribe(loading => {
      if (!loading) {
        
        this.tipoParticipacionService.actives().subscribe(data => {
          this.tipoParticipaciones.next(data);
          this.cdr.detectChanges();
        });
        
        this.tipoFirmaService.actives().subscribe(data => {
          this.tipoFirmas.next(data);
          this.cdr.detectChanges();
        });

        this.tipoFirmanteService.actives().subscribe(data => {
          this.tipoFirmantes.next(data);
          this.cdr.detectChanges();
        });
    
      }
    });
  }
  
  ngOnInit() {

    // console.log('default',this.defaults.payload);
    this.principal = this.defaults.payload.principal;

    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {

      this.mode = 'global.edit';

      this.intervinienteService.get(this.defaults.payload.id).subscribe(data => {
        this.interviniente = data;
        this.buildForm();
        this.loadingDataForm.next(false);
        // console.log(data);
        
      })
    } else {
      this.interviniente = {} as Interviniente;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }

  buildForm() {

    // this.itemForm = this.fb.group({
    //   tipoDireccion: new FormControl(this.direccion.tipoDireccion || '', [Validators.required]),
    //   parroquia: new FormControl(this.direccion.parroquia || '', [Validators.required]),
    //   estado: new FormControl(this.direccion.estado || '', [Validators.required])
      
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

    // console.log('mode ', this.mode);
    this.updateData(this.interviniente);// aca actualizamos la direccion
    if(this.isNew){
      this.interviniente.persona = this.defaults.payload.persona;
    }
    // console.log(this.direccion);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.intervinienteService, this.interviniente, 'La Dirección', this.interviniente.id == undefined);

    // this.dialogRef.close();
  }

  // nombreVia(){
  //   if(!this.f.via.value || !this.vias.value){
  //     return 'Vía';
  //   }
  //   return this.vias.value.filter(v=>v.id==this.f.via.value)[0]?.nombre;
  // }

  // nombreContruccion(){
  //   if(!this.f.construccion.value || !this.construcciones.value){
  //     return 'Construcción';
  //   }
  //   return this.construcciones.value.filter(c=>c.id==this.f.construccion.value)[0]?.nombre;
  // }

  // nombreNucleo(){
  //   if(!this.f.nucleo.value || !this.nucleos.value){
  //     return 'Núcleo';
  //   }
  //   return this.nucleos.value.filter(n=>n.id==this.f.nucleo.value)[0]?.nombre;
  // }

  // nombreCiudad(){

  //   if(!this.f.municipio.value || this.f.municipio.value.length==0 || !this.municipios.value){
  //     return '';
  //   }
  //   return this.municipios.value.filter(m=>m.id===this.f.municipio.value)[0]?.ciudad || '';
  // }

}