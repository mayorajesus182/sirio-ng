import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoRegional } from 'src/@sirio/domain/services/control-efectivo/saldo-regional.service';
import { getPaginatorIntl } from 'src/@sirio/shared/base/table-base.component';
import { ListColumn } from 'src/@sirio/shared/list/list-column.model';
import { AgenciaChartPopupComponent } from '../../agencia-resumen/popup/agencia-chart.popup.component';

@Component({
  selector: 'sirio-region-table-widget',
  templateUrl: './region-table-widget.component.html',
  styleUrls: ['./region-table-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionTableWidgeComponent implements OnInit, AfterViewInit {

  @Input() columns: ListColumn[];
  @Input() pageSize = 10;
  subject$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data$: Observable<any[]> = this.subject$.asObservable();
  regiones$: any[];
  // private dataSource: MatTableDataSource<any>[] | null;
  tableDataSources: MatTableDataSource<any>[] = [];
  // @ViewChild(MatPaginator, { static: true })
  // paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  @Input() monedas: Observable<Moneda[]>;
  @Input() moneda_curr: Moneda = undefined;

  private currentIndex = 0;
  currentMoneda: Moneda;
  total: number = 0;
  availableCoins: Moneda[] = [];

  constructor(private dialog: MatDialog,
    private cdr: ChangeDetectorRef) {
  }

  @Input() set data(value: any[]) {
    this.subject$.next(value);
  };

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  @ViewChildren(MatPaginator)  set matPaginators(mps: QueryList<MatPaginator>) {
    // console.log('paginators');
    // console.log(mps);
    // console.log('end paginators');
    if(mps && this.tableDataSources[this.currentIndex]){

      this.tableDataSources[this.currentIndex].paginator = mps.last;
        this.tableDataSources[this.currentIndex].paginator._intl = getPaginatorIntl();
        this.tableDataSources[this.currentIndex].sort = this.sort;
     
        this.cdr.detectChanges();

    }

  }


  ngOnInit() {


    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((values) => {


      this.regiones$ = values

      this.total = values.map(r => r.data as SaldoRegional[]).map(s => s.map(ss => ss.saldo).reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);

    });



    this.monedas.subscribe(list => {
      // console.log('monedas observable',list);

      this.currentMoneda = this.moneda_curr || list[0];
      this.availableCoins = list;
      this.reload();
    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;



  }
  progress(row: SaldoRegional) {

    return row.saldo * 100.0 / row.maximo;

  }
  reload() {

  }

  openDataAgencia(elem) {

    this.dialog.open(AgenciaChartPopupComponent, {
      panelClass: 'dialog-frame',
      position: { top: '3%' },
      width: '75%',
      disableClose: true,
      data: { id: elem.agencia, title: `Agencia ${elem.agencia}`, subtitle: elem.agenciaNombre, monedas: this.availableCoins }
    });
  }

  expandedOn(event, index: number) {
    // console.log('1 evento expanded ', event, index);

    if (!event) {
      // this.tableDataSources[index].paginator = undefined;
      // this.paginator.pageIndex = 0;
      return;
    }

    // this.paginator=undefined;
    this.currentIndex = index;
    // this.dataSource[index].data = this.regiones$[index].data;
    this.regiones$[index].show = event;

    if (!this.tableDataSources[index]) {
      this.tableDataSources[index] = new MatTableDataSource(this.regiones$[index].data);
    }



    this.cdr.detectChanges();
  }

  getTotalRegion(index: number) {

    return (this.regiones$[index].data as SaldoRegional[]).map(s => s.saldo).reduce((a, b) => a + b, 0);

  }

  getTotalAgencia(index: number) {

    return (this.regiones$[index].data as SaldoRegional[]).map(s => s.saldo).reduce((a, b) => a + b, 0);

  }

}
