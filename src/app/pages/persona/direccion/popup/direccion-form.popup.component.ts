import { AfterViewInit, ChangeDetectorRef, Component, Inject, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { RegularExpConstants } from 'src/@sirio/constants';
import { Construccion, ConstruccionService } from 'src/@sirio/domain/services/configuracion/domicilio/construccion.service';
import { Estado, EstadoService } from 'src/@sirio/domain/services/configuracion/localizacion/estado.service';
import { Municipio, MunicipioService } from 'src/@sirio/domain/services/configuracion/localizacion/municipio.service';
import { Nucleo, NucleoService } from 'src/@sirio/domain/services/configuracion/localizacion/nucleo.service';
import { Parroquia, ParroquiaService } from 'src/@sirio/domain/services/configuracion/localizacion/parroquia.service';
import { TipoDireccion, TipoDireccionService } from 'src/@sirio/domain/services/configuracion/localizacion/tipo-direccion.service';
import { Via, ViaService } from 'src/@sirio/domain/services/configuracion/localizacion/via.service';
import { ZonaPostal, ZonaPostalService } from 'src/@sirio/domain/services/configuracion/localizacion/zona-postal.service';
import { Direccion, DireccionService } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { PopupBaseComponent } from 'src/@sirio/shared/base/popup-base.component';


@Component({
  selector: 'sirio-direccion-form.popup',
  templateUrl: './direccion-form.popup.component.html',
  styleUrls: ['./direccion-form.popup.component.scss']
})
export class DireccionFormPopupComponent extends PopupBaseComponent implements OnInit, AfterViewInit {

  direccion: Direccion = {} as Direccion;
  principal: boolean=false;
  public tiposDirecciones = new BehaviorSubject<TipoDireccion[]>([]);
  public parroquias = new BehaviorSubject<Parroquia[]>([]);
  public municipios = new BehaviorSubject<Municipio[]>([]);
  // public paises = new BehaviorSubject<Pais[]>([]);
  public estados = new BehaviorSubject<Estado[]>([]);
  public zonasPostales = new BehaviorSubject<ZonaPostal[]>([]);
  public vias = new BehaviorSubject<Via[]>([]);
  public nucleos = new BehaviorSubject<Nucleo[]>([]);
  public construcciones = new BehaviorSubject<Construccion[]>([]);

  // public nombreVia = new BehaviorSubject<NombreVia[]>([]);
  // public nombreNucleo = new BehaviorSubject<NombreNucleo[]>([]);
  // public estadonombreCostruccion = new BehaviorSubject<EstadonombreCostruccion[]>([]);

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: any,
    protected injector: Injector,
    dialogRef: MatDialogRef<DireccionFormPopupComponent>,
    private direccionService: DireccionService,
    private tipoDireccionesService: TipoDireccionService,
    private estadoService: EstadoService,
    private municipioService: MunicipioService,
    private parroquiaService: ParroquiaService,
    private zonaPostalService: ZonaPostalService,
    private viaService: ViaService,

    // private nombreVia: nombreViaService,
    // private nombreNucleo: NombreNucleoService,
    // private nombreCostruccion: NombreCostruccionService,


    private nucleoService: NucleoService,
    private construccionService: ConstruccionService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder) {

    super(dialogRef, injector)
  }
  ngAfterViewInit(): void {
    // esto se utiliza en modo edición

    this.loading$.subscribe(loading => {
      if (!loading) {

        if (this.f.estado.value) {

          this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
            this.municipios.next(data);
            this.cdr.detectChanges();
          });
        }

        if (this.f.municipio.value) {
          this.parroquiaService.activesByMunicipio(this.f.municipio.value).subscribe(data => {
            this.parroquias.next(data);
            this.cdr.detectChanges();
          });
        }

        if (this.f.parroquia.value) {
          this.zonaPostalService.activesByParroquia(this.f.parroquia.value).subscribe(data => {
            this.zonasPostales.next(data);
            this.cdr.detectChanges();
          });
        }

        this.tipoDireccionesService.actives().subscribe(data => {
          if(this.isNew ){
            if(!this.principal){
              this.tiposDirecciones.next(data);              
            }else{              
              this.tiposDirecciones.next(data.filter(t=>t.id!='PR'));
            }
          }else{
            this.tiposDirecciones.next(data);
          }
          this.cdr.detectChanges();
        })
    
        this.estadoService.activesByPaisInstitucion().subscribe(data => {
          this.estados.next(data);
          this.cdr.detectChanges();
        });
    
        this.viaService.actives().subscribe(data => {
          this.vias.next(data);
          this.cdr.detectChanges();
        });
    
        this.nucleoService.actives().subscribe(data => {
          this.nucleos.next(data);
          this.cdr.detectChanges();
        });
    
        this.construccionService.actives().subscribe(data => {
          this.construcciones.next(data);
          this.cdr.detectChanges();
        });

      }
    });
  }

  ngOnInit() {

    // console.log('default',this.defaults.payload);
    this.principal = this.defaults.payload.principal;

    

    // this.nombreViaService.actives().subscribe(data => {
    //   this.nombreVia.next(data);
    //   this.cdr.detectChanges();
    // });

    // this.nombreNucleoService.actives().subscribe(data => {
    //   this.nombreNucleo.next(data);
    //   this.cdr.detectChanges();
    // });

    // this.estadonombreCostruccionService.actives().subscribe(data => {
    //   this.estadonombreCostruccion.next(data);
    //   this.cdr.detectChanges();
    // });

    this.loadingDataForm.next(true);
    if (this.defaults.payload.id) {

      this.mode = 'global.edit';

      this.direccionService.get(this.defaults.payload.id).subscribe(data => {
        this.direccion = data;
        this.buildForm();
        this.loadingDataForm.next(false);
        // console.log(data);
        
      })
    } else {
      this.direccion = {} as Direccion;
      this.buildForm();
      this.loadingDataForm.next(false);
    }
  }

  buildForm() {

    this.itemForm = this.fb.group({
      tipoDireccion: new FormControl(this.direccion.tipoDireccion || '', [Validators.required]),
      parroquia: new FormControl(this.direccion.parroquia || '', [Validators.required]),
      estado: new FormControl(this.direccion.estado || '', [Validators.required]),
      municipio: new FormControl(this.direccion.municipio || '', [Validators.required]),
      
      
      zonaPostal: new FormControl(this.direccion.zonaPostal || '', [Validators.required]),
      via: new FormControl(this.direccion.via || '', [Validators.required]),
      nucleo: new FormControl(this.direccion.nucleo || '', [Validators.required]),
      construccion: new FormControl(this.direccion.construccion || '', [Validators.required]),
      referencia: new FormControl(this.direccion.referencia || '', [Validators.required, Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),

      nombreVia: new FormControl(this.direccion.nombreVia || '', [Validators.required, Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
 
      nombreNucleo: new FormControl(this.direccion.nombreNucleo || '', [Validators.required, Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)]),
 
      nombreConstruccion: new FormControl(this.direccion.nombreConstruccion || '', [Validators.required, Validators.required, Validators.pattern(RegularExpConstants.ALPHA_NUMERIC_CHARACTERS_SPACE)])
    });


    this.f.estado.valueChanges.subscribe(value => {
      this.municipioService.activesByEstado(this.f.estado.value).subscribe(data => {
        this.municipios.next(data);
        this.cdr.detectChanges();
      });
    });

    this.f.municipio.valueChanges.subscribe(value => {
      this.parroquiaService.activesByMunicipio(this.f.municipio.value).subscribe(data => {
        this.parroquias.next(data);
        this.cdr.detectChanges();
      });
    });

    this.f.parroquia.valueChanges.subscribe(value => {
      this.zonaPostalService.activesByParroquia(value).subscribe(data => {
        this.zonasPostales.next(data);
        this.cdr.detectChanges();
      });
    });

    this.cdr.detectChanges();
  }

  save() {

    // console.log('mode ', this.mode);
    this.updateData(this.direccion);// aca actualizamos la direccion
    if(this.isNew){
      this.direccion.persona = this.defaults.payload.persona;
    }
    // console.log(this.direccion);
    // TODO: REVISAR EL NOMBRE DE LA ENTIDAD
    this.saveOrUpdate(this.direccionService, this.direccion, 'La Dirección', this.direccion.id == undefined);

    // this.dialogRef.close();
  }

  nombreVia(){
    if(!this.f.via.value || !this.vias.value){
      return 'Vía';
    }
    return this.vias.value.filter(v=>v.id==this.f.via.value)[0]?.nombre;
  }

  nombreContruccion(){
    if(!this.f.construccion.value || !this.construcciones.value){
      return 'Construcción';
    }
    return this.construcciones.value.filter(c=>c.id==this.f.construccion.value)[0]?.nombre;
  }

  nombreNucleo(){
    if(!this.f.nucleo.value || !this.nucleos.value){
      return 'Núcleo';
    }
    return this.nucleos.value.filter(n=>n.id==this.f.nucleo.value)[0]?.nombre;
  }

}