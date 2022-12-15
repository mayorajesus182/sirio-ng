import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SaldoRegional } from 'src/@sirio/domain/services/control-efectivo/saldo-regional.service';
import { ListColumn } from 'src/@sirio/shared/list/list-column.model';

@Component({
  selector: 'sirio-agencia-table-widget',
  templateUrl: './agencia-table-widget.component.html',
  styleUrls: ['./agencia-table-widget.component.scss']
})
export class AgenciatTableWidgeComponent implements OnInit, AfterViewInit {

  @Input() columns: ListColumn[];
  @Input() pageSize = 10;
  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  data$: Observable<SaldoRegional[]> = this.subject$.asObservable();
  dataSource: MatTableDataSource<any> | null;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dialog: MatDialog) {
  }

  @Input() set data(value: any[]) {
    this.subject$.next(value);
  };

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();

    this.data$.pipe(
      filter(data => !!data)
    ).subscribe((values) => this.dataSource.data = values);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  progress(row:SaldoRegional){

    return row.saldo*100.0/row.maximo;

  }
  reload(){
    
  }

}
