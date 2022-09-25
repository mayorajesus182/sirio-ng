

import { ChangeDetectorRef, Component, ElementRef, Injector, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { BehaviorSubject, iif, merge } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ApiConfConstants } from "src/@sirio/constants";
import { DatasourceService } from "src/@sirio/services/datasource.service";
import { NavigationService } from "src/@sirio/services/navigation.service";
import { SidenavItem } from "src/app/layout/sidenav/sidenav-item/sidenav-item.interface";

import { SnackbarService } from "../../services/snackbar.service";
import { SweetAlertService } from "../../services/swal.service";
import { MethodComponentApi } from "../actions/actions-nav.component";

@Component({
    template: '',
    providers: [
        {
            provide: "snack", useClass: SnackbarService
        },
        {
            provide:"navService", useClass: NavigationService
        },
        {
            provide:"router", useClass: Router
        },
        {
            provide:"swalService", useClass:SweetAlertService
        },
        {
            provide: "spinner", useClass: NgxSpinnerService
        }
    ]
})
export class TableBaseComponent {

    public dataSource: DatasourceService;

    @ViewChildren(MatPaginator) paginators: QueryList<MatPaginator>
    @ViewChild(MatSort) sort: MatSort;
    filter = new BehaviorSubject<string>('');
    // @ViewChild('searchInput') searchInput: ElementRef;
    private searchTerm: any = undefined;
    pageEvent: PageEvent;
    protected dialogRef: MatDialogRef<any>;
    public actions = new BehaviorSubject<SidenavItem[]>([]);
    public buttons = new BehaviorSubject<SidenavItem[]>([]);


    protected snack: SnackbarService;
    protected navService: NavigationService;
    protected router: Router;
    protected swalService: SweetAlertService;
    protected spinner: NgxSpinnerService;

    colors = {
        REG: 'bg-success',
        VER: 'accent',
        VAL: 'accent',
        BLQ: 'bg-red',
        ANU: 'bg-red',
        APR: 'primary',
        ACT: 'primary'
    }

    constructor(protected dialog: MatDialog, protected injector:Injector) {
        this.router = injector.get(Router);
        this.navService = injector.get(NavigationService);
        this.spinner = injector.get(NgxSpinnerService);
        this.snack = injector.get(SnackbarService);
        this.spinner = injector.get(NgxSpinnerService);
        this.swalService = injector.get(SweetAlertService);

        if (this.router) {

            const url = this.router.url;
            this.navService.getActions(url.substring(ApiConfConstants.APP_NAME.length)).subscribe(data => {
                this.actions.next(data);
                // console.log('actions ', data);

            });
        }

    }

    protected buildPrefixPath(path:string){
        return `/${ApiConfConstants.APP_NAME}/${path}/`;
    }


    public actionAPI(): MethodComponentApi {
        return {
            invoke: (element, name) => {
                // console.log('this ',element, 'method '+name);

                this[name](element)
            }
        }
    }

    public eventActionClick(event){

        
        if(!event){
            return;
        }
        console.log('click action ',event);
    }

    // public buttonAPI(): ButtonComponentApi {
    //     return {
    //         invoke: (name) => {
    //             console.log('method ' + name);
    //             this[name]();
    //         }
    //     }
    // }

    protected init(service, nameColumnSort: string, method?: string, paramsOpts?: any, tableNameLoading?: any) {

        this.dataSource = new DatasourceService(service, method);
        this.dataSource.paramsOpts = paramsOpts;
        this.dataSource.loadData('', nameColumnSort, 'asc', 0, 15);

        if (service.searchTerm) {
            this.filter= service.searchTerm;

            service.searchTerm.asObservable().pipe(
                debounceTime(150)).subscribe(term => {
                    // console.log('data seach ', term);
                    this.paginators.first._intl.itemsPerPageLabel = 'Items por Pag.';
                    this.paginators.first.pageIndex = 0;
                    // console.log('TERM 1', term);

                    this.searchTerm = term;
                    this.refreshElementList();
                })

        } else {


            service.onSearch().pipe(
                debounceTime(150),
                distinctUntilChanged(),
                tap(term => {
                    this.paginators.first._intl.itemsPerPageLabel = 'Items por Pag.';
                    this.paginators.first.pageIndex = 0;
                    // console.log('term ' + term);
                    console.log('TERM 2', term);
                    this.searchTerm = term;
                    this.refreshElementList();
                })
            ).subscribe();
        }




    }


  onFilterChange(value) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    const term = value.toLowerCase();
    this.filter.next(term);
  }

    public filterElementList(keyword, elements) {
        //console.log('searching ');

        const val = keyword.toLowerCase();

        if (!val || val.length == 0) {
            return elements;
        }

        var columns = Object.keys(elements[0]);

        columns.splice(columns.length - 1);

        // console.log(columns);
        if (!columns.length)
            return elements;

        const rows = elements.filter(function (d) {
            for (let i = 0; i <= columns.length; i++) {
                let column = columns[i];
                // console.log(d[column]);
                if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
                    return true;
                }
            }
        });

        // console.log('result ',rows);


        return rows;
    }

    protected afterInit( componentNameLoading?: string) {


        if (this.sort) {
            this.sort.sortChange.subscribe(() => this.paginators.first.pageIndex = 0);

            merge(this.sort.sortChange, this.paginators.first.page).pipe(
                tap(() => this.refreshElementList())
            ).subscribe();

        }

        if (this.spinner) {

            this.dataSource.loading$.subscribe(val => {
                // console.log('loading....', val);

                if (val) {
                    var opts = {} as Spinner;
                    // opts.type = 'line-scale-pulse-out-rapid';
                    opts.type = 'ball-scale-ripple-multiple';
                    opts.size = 'medium';
                    opts.fullScreen = false;
                    opts.color = '#3f51b5';
                    opts.bdColor = 'rgba(190, 190, 190, 0.05)';

                    this.spinner.show(componentNameLoading || 'componentLoading', opts);
                } else {

                    this.spinner.hide(componentNameLoading || 'componentLoading');
                }
            });
        }


    }

    protected refreshElementList() {
        this.dataSource.loadData(
            this.searchTerm ? this.searchTerm : '',
            this.sort.active,
            this.sort.direction,
            this.paginators.first.pageIndex,
            this.paginators.first.pageSize);
    }

    protected showFormPopup(popupComponent, _title, data, _isNew, withDialog = '60%') {
        let data_aux = { payload: undefined, title: undefined, isNew: undefined };

        if (!data.payload) {
            data_aux.payload = data;
        } else {
            data_aux = data;
        }

        data_aux.title = _title;
        data_aux.isNew = _isNew;

        this.dialogRef = this.dialog.open(popupComponent, {
            panelClass: 'form-regla-OSCES-dialog',
            width: withDialog,
            disableClose: true,
            data: data_aux
        });

        this.dialogRef.afterClosed().subscribe(res => {

            if (!res) {
                return;
            }
            this.refreshElementList();
        });
    }

    protected showSimplePopup(popupComponent, title: string, data, withDialog = '50%') {

        let data_aux = { payload: undefined, title: undefined, isNew: undefined };

        if (!data.payload) {

            data_aux.payload = data;
        } else {
            data_aux = data;
        }

        data_aux.title = title;

        this.dialogRef = this.dialog.open(popupComponent, {
            panelClass: 'form-regla-OSCES-dialog',
            width: withDialog,
            disableClose: true,
            data: data_aux
        });
        return this.dialogRef;
    }

    protected sortElementList(elements) {
        const data = elements.slice();
        if (!this.sort.active || this.sort.direction === '') {
            return elements;
        }

        let sortedData = data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            var columns = Object.keys(elements[0]);

            for (let i = 0; i <= columns.length; i++) {
                let column = columns[i];
                // console.log(d[column]);
                if (this.sort.active === column) {
                    return this.compare(a[column], b[column], isAsc);
                }

            }

            return 0;
        });

        return sortedData;
    }

    private compare(a: number | string, b: number | string, isAsc: boolean) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }



    protected errorResponse(errors, isNew: boolean = false) {

        this.snack.show({
            message: 'No se pudo ' + (isNew ? ' crear ' : 'actualizar') + ' el elemento',
            verticalPosition: 'bottom',
            type: 'danger'

        });
    }

    protected successResponse(entityName: string, event: string, noClose?: boolean) {


        this.snack.show({
            message: `${entityName} fue ${event} satisfactoriamente!`,
            verticalPosition: 'bottom'
        });
    }


    protected filterObjectList(keyword, fromList, toList) {
        // console.log("evento search ", event);


        if (!fromList || fromList.length == 0) {
            return;
        }
        // get the search keyword
        let search = keyword;
        if (!search) {
            toList.next(fromList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        toList.next(
            fromList.filter(elem => elem.descripcion.toLowerCase().indexOf(search) >= 0)
        );

    }

    protected applyChangeStatus(service, element: any, content: string, changeDetector?: ChangeDetectorRef) {


        this.swalService.show(`message.${element.activo ? 'inactivateRecord' : 'activateRecord'}`, content).then((resp) => {


            if (!resp.dismiss) {

                service['changeStatus'](element.id, !element.activo).subscribe(data => {
                    this.snack.show({ message: 'Estatus actualizado satisfactoriamente!', verticalPosition: 'bottom' });
                    element.activo = !element.activo;
                    changeDetector.detectChanges()
                });
            }

        });

    }


}

export function getPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl();

    paginatorIntl.itemsPerPageLabel = 'Elementos por pag.:';
    paginatorIntl.nextPageLabel = 'Pag. siguiente';
    paginatorIntl.previousPageLabel = 'Pag. anterior';
    paginatorIntl.lastPageLabel = 'Última pag.';
    paginatorIntl.firstPageLabel = 'Primera pag.';

    return paginatorIntl;
}
