import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { MaterialTransporte, MaterialTransporteService } from 'src/@sirio/domain/services/transporte/materiales/material-transporte.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';




@Component({
  selector: 'app-material-transporte-table',
  templateUrl: './material-transporte-table.component.html',
  styleUrls: ['./material-transporte-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class MaterialTransporteTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  public materialData: MaterialTransporte[];
  public materiales: ReplaySubject<MaterialTransporte[]> = new ReplaySubject<MaterialTransporte[]>();
  public keywords: string = '';
  transportistaId: string;
  transportista: string;
  datosPersona: string;
  editing: any[] = [];
  btnState: boolean = false;


  constructor(
    injector: Injector,
    dialog: MatDialog,
    private route: ActivatedRoute,
    private materialTransporteService: MaterialTransporteService,
    private cdr: ChangeDetectorRef) {
    super(dialog, injector);
  }


  loadList() {
    this.materialTransporteService.activesByTransportista(this.transportistaId).subscribe((data) => {
      this.materialData = data;
      this.materiales.next(data.slice());
    });
  }

  ngOnInit() {

    this.transportistaId = this.route.snapshot.params['id'];
    
    const data = history.state.data;

    if(data){
      this.transportista = data.nombre;
      sessionStorage.setItem('trans_nombre',data.nombre);
    }else{
      this.transportista = sessionStorage.getItem('trans_nombre')
    }

    if (this.transportistaId) {
      this.loadList();
    }
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {

  }

  onFilterChange(value) {

    value = value.trim();
    value = value.toLowerCase();

    this.materiales.next(
      this.materialData.filter(item => {
        if (
          item.nombre &&
          item.nombre
            .toString()
            .toLowerCase()
            .indexOf(value) !== -1 || !value
        ) {

          return true;
        }
      }).slice());
  }


  update(current: MaterialTransporte, event) {

    this.btnState = true;


    this.materialTransporteService.update(current).subscribe(data => {
      this.btnState = false;
      this.successResponse('Avaluo', 'Actualizar')
    }, err => {
      this.btnState = false;
      this.errorResponse(undefined, false)
    });

  }

}

