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

  public materiales: ReplaySubject<MaterialTransporte[]> = new ReplaySubject<MaterialTransporte[]>();
  
  transportistaId: string;
  transportista: string;
  datosPersona: string;



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
      this.materiales.next(data.slice());
      this.cdr.markForCheck();

      console.log(data);
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



  activateOrInactivate(row: MaterialTransporte) {
    if (!row || row.costo<=0) {
      return;
    }

    this.applyChangeStatus(this.materialTransporteService, row, row.material, this.cdr);
  }

}

