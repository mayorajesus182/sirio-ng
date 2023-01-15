import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Moneda } from 'src/@sirio/domain/services/configuracion/divisa/moneda.service';
import { SaldoAgenciaService } from 'src/@sirio/domain/services/control-efectivo/saldo-agencia.service';
import { SaldoRegional } from 'src/@sirio/domain/services/control-efectivo/saldo-regional.service';
import { getPaginatorIntl } from 'src/@sirio/shared/base/table-base.component';
import { ListColumn } from 'src/@sirio/shared/list/list-column.model';
import { AgenciaChartPopupComponent } from '../agencia-resumen/popup/agencia-chart.popup.component';

@Component({
  selector: 'sirio-principal-table-widget',
  templateUrl: './principal-table-widget.component.html',
  styleUrls: ['./principal-table-widget.component.scss']
})
export class PrincipalTableWidgeComponent implements OnInit, AfterViewInit {

  @Input() columns: ListColumn[];
  @Input() pageSize = 10;
  subject$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data$: Observable<any[]> = this.subject$.asObservable();
  regiones$: any[];
  // private dataSource: MatTableDataSource<any>[] | null;
  tableDataSources: MatTableDataSource<any>[] = [];
  // @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  @Input() monedas: Observable<Moneda[]>;
  @Input() moneda_curr: Moneda = undefined;


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


  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    if(mp){
      this.paginator._intl = getPaginatorIntl();
      this.paginator.pageIndex = 0;

    }
    // console.log(this.paginator);

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

  openRegion(index: number, status) {

    // this.dataSource[index].data = this.regiones$[index].data;
    this.regiones$[index].show = status;

    if (!this.tableDataSources[index]) {
      this.tableDataSources[index] = new MatTableDataSource();
      this.tableDataSources[index].data = this.regiones$[index].data;

    }
    if (this.paginator && this.regiones$[index].show) {
      // console.log('consegui paginador');

      this.tableDataSources[index].paginator = this.paginator;

    }
    this.tableDataSources[index].sort = this.sort;
    this.cdr.detectChanges();

  }

  getTotalRegion(index: number) {

    return (this.regiones$[index].data as SaldoRegional[]).map(s => s.saldo).reduce((a, b) => a + b, 0);

  }

  getTotalAgencia(index: number) {

    return (this.regiones$[index].data as SaldoRegional[]).map(s => s.saldo).reduce((a, b) => a + b, 0);

  }

}
