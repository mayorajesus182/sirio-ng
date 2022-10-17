import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit, ɵCodegenComponentFactoryResolver } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ConoMonetario, ConoMonetarioService } from 'src/@sirio/domain/services/configuracion/divisa/cono-monetario.service';
import { Cajetin, CajetinService } from 'src/@sirio/domain/services/organizacion/cajetin.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';




@Component({
  selector: 'app-cajetin-table',
  templateUrl: './cajetin-table.component.html',
  styleUrls: ['./cajetin-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInUpAnimation, fadeInRightAnimation]
})

export class CajetinTableComponent extends TableBaseComponent implements OnInit, AfterViewInit, OnDestroy {

  public cajetinData: Cajetin[];
  public cajetines: ReplaySubject<Cajetin[]> = new ReplaySubject<Cajetin[]>();
  public conos: ReplaySubject<ConoMonetario[]> = new ReplaySubject<ConoMonetario[]>();
  public keywords: string = '';
  atmId: string;
  atm: string;
  datosPersona: string;
  editing: any[] = [];
  btnState: boolean = false;


  constructor(
    injector: Injector,
    dialog: MatDialog,
    private route: ActivatedRoute,
    private cajetinService: CajetinService,
    private conoMonetarioService: ConoMonetarioService,
    private cdr: ChangeDetectorRef) {
    super(dialog, injector);
  }


  loadList() {
    this.cajetinService.activesByAtm(this.atmId).subscribe((data) => {
      this.cajetinData = data;
      console.log(data);      
      this.cajetines.next(data.slice());
    });

    //TODO: ESTO DE USD EN DURO
    this.conoMonetarioService.activesByMoneda('USD').subscribe((data) => {
      this.conos.next(data.slice());
    });
  }

  ngOnInit() {

    this.atmId = this.route.snapshot.params['id'];

    const data = history.state.data;

    console.log(' this.atmId ',  this.atmId);
    console.log('dataaaaaa ', data);
    
    if (data) {
      console.log('dataaaaaaaaaaaaaaaaa');
      
      this.atm = data.codigo;
      sessionStorage.setItem('trans_nombre', data.codigo);
    } else {
      console.log('no dataaaaaaaaaaaaa', sessionStorage.getItem('trans_nombre'));
      this.atm = sessionStorage.getItem('trans_nombre')
    }

    if (this.atmId) {
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

    this.cajetines.next(
      this.cajetinData.filter(item => {
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


  update(current: Cajetin, event) {
    this.btnState = true;

    this.cajetinService.update(current).subscribe(data => {
      this.btnState = false;
      this.successResponse('El Registro se', 'Actualizó')
    }, err => {
      this.btnState = false;
      this.errorResponse(undefined, false)
    });

  }


}

