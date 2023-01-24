

import { Location } from "@angular/common";
import { HttpResponse } from "@angular/common/http";
import { ChangeDetectorRef, Component, Injector, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator, MatPaginatorIntl, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from '@angular/router';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from 'ngx-spinner';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { BehaviorSubject, merge } from "rxjs";
import { tap } from 'rxjs/operators';
import { ApiConfConstants } from "src/@sirio/constants";
import { DatasourceService } from "src/@sirio/services/datasource.service";
import { NavigationService } from "src/@sirio/services/navigation.service";
import { SidenavItem } from "src/app/layout/sidenav/sidenav-item/sidenav-item.interface";
import { saveAs } from 'file-saver';
import { SnackbarService } from "src/@sirio/services/snackbar.service";
import { SweetAlertService } from "src/@sirio/services/swal.service";
import { MethodComponentApi } from "../actions/actions-nav.component";

@Component({
    template: '',
    providers: [
        {
            provide: "snack", useClass: SnackbarService
        },
        {
            provide: "navService", useClass: NavigationService
        },
        {
            provide: "router", useClass: Router
        },
        {
            provide: "swalService", useClass: SweetAlertService
        },
        {
            provide: "spinner", useClass: NgxSpinnerService
        },
        {
            provide: "location", useClass: Location
        }
    ]
})
export class TableBaseComponent {
    public ColumnMode = ColumnMode;
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
    protected location: Location;
    private nameColumnSortDef: string;

    colors = {
        REG: 'bg-success',
        VER: 'accent',
        VAL: 'accent',
        BLQ: 'bg-red',
        ANU: 'bg-red',
        APR: 'primary',
        ACT: 'primary'
    }

    constructor(protected dialog: MatDialog, protected injector: Injector) {
        this.router = injector.get(Router);
        this.navService = injector.get(NavigationService);
        this.spinner = injector.get(NgxSpinnerService);
        this.snack = injector.get(SnackbarService);
        this.spinner = injector.get(NgxSpinnerService);
        this.swalService = injector.get(SweetAlertService);
        this.location = injector.get(Location);

        if (this.router) {

            const url = this.router.url;
            this.navService.getActions(url.substring(ApiConfConstants.APP_NAME.length)).subscribe(data => {
                this.actions.next(data);
                // console.log('actions ', data);

            });
        }

    }

    protected buildPrefixPath(path: string) {
        return `/${ApiConfConstants.APP_NAME}/${path}/`.split('//').join('/');
    }


    public actionAPI(): MethodComponentApi {
        return {
            invoke: (element, name) => {
                // console.log('this ',element, 'method '+name);

                this[name](element)
            }
        }
    }

    public eventActionClick(event) {


        if (!event) {
            return;
        }
        console.log('click action ', event);
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
        this.nameColumnSortDef= nameColumnSort;

        this.filter.subscribe(text => {
            
            if (text != undefined && this.sort) {
                console.log('search by filter **'+text+'**');
                this.searchTerm = text;
                this.refreshElementList();
            }

        });

        if (service.searchTerm) {
            // this.filter = service.searchTerm;

            // service.searchTerm.asObservable().pipe(
            //     debounceTime(150)).subscribe(term => {

            //         this.paginators.first._intl.itemsPerPageLabel = 'Items por Pag.';
            //         this.paginators.first.pageIndex = 0;


            //         this.searchTerm = term;
            // this.refreshElementList();
            // })

        } else {


            // service.onSearch().pipe(
            //     debounceTime(150),
            //     distinctUntilChanged(),
            //     tap(term => {
            //         this.paginators.first._intl.itemsPerPageLabel = 'Items por Pag.';
            //         this.paginators.first.pageIndex = 0;
            //         // console.log('term ' + term);
            //         console.log('TERM 2', term);
            // this.searchTerm = term;
            // this.refreshElementList();
            //     })
            // ).subscribe();
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

    protected afterInit(componentNameLoading?: string) {


        if (this.sort) {
            this.sort.sortChange.subscribe(() => this.paginators.first.pageIndex = 0);

            merge(this.sort.sortChange, this.paginators.first.page).pipe(
                tap(() => this.refreshElementList())
            ).subscribe();

            this.dataSource.loadData('', this.nameColumnSortDef, this.sort.direction, 0, 15);
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
                    opts.color = '#2769a7;';
                    opts.bdColor = 'rgba(190, 190, 190, 0.05)';

                    this.spinner.show(componentNameLoading || 'componentLoading', opts);
                } else {

                    this.spinner.hide(componentNameLoading || 'componentLoading');
                }
                if (this.paginators.first) {

                    this.paginators.first._intl = getPaginatorIntl();

                }
            });
        }


    }

    protected download(fileName, blob) {
        console.log('archivo-saldo ' + fileName);

        /*let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        link.click();*/

        saveAs(blob, fileName);
    }

    protected getFileName(response: HttpResponse<Blob>, ext?: string) {
        let filename: string;
        try {
            // console.log('headers ', response.headers);
            // {
            //     "key": "",
            //     "value": [
            //         "attachment; filename=consulta_20210711_0132.xlsx"
            //     ]
            // }

            const contentDisposition: string = response.headers.get('content-disposition');
            console.log('content', contentDisposition);

            let i = contentDisposition.lastIndexOf('=');
            filename = contentDisposition.substring(i + 1);
        } catch (e) {

            filename = `reporte.${ext ? ext : 'xlsx'}`
        }
        return filename
    }



    protected refreshElementList() {
        if (!this.dataSource) {
            console.log('no existe datasource');
            
            return;
        }
        console.log('sort ', this.sort);
        this.dataSource.loadData(
            this.searchTerm ? this.searchTerm : '',
            this.sort.active,
            this.sort.direction,
            this.paginators.first.pageIndex,
            this.paginators.first.pageSize);
    }

    protected showFormPopup(popupComponent, data, withDialog = '60%') {
        let data_aux = { payload: undefined, title: undefined, isNew: undefined };

        if (!data.payload) {
            data_aux.payload = data;
        } else {
            data_aux = data;
        }

        // data_aux.title = _title;
        // data_aux.isNew = _isNew;

        this.dialogRef = this.dialog.open(popupComponent, {
            panelClass: 'dialog-frame',
            position: { top: '3%' },
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

        return this.dialogRef;
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
            panelClass: 'dialog-frame',
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

    protected updateDataFromValues(current = {}, values) {
        Object.assign(current, values);
    }


}

export function getPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl();

    paginatorIntl.itemsPerPageLabel = '';
    paginatorIntl.nextPageLabel = 'Pag. siguiente';
    paginatorIntl.previousPageLabel = 'Pag. anterior';
    paginatorIntl.lastPageLabel = 'Última pag.';
    paginatorIntl.firstPageLabel = 'Primera pag.';

    paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
        if (length === 0 || pageSize === 0) {
            return `0 / ${length}`;
        }

        length = Math.max(length, 0);

        const startIndex: number = page * pageSize;
        const endIndex: number = startIndex < length
            ? Math.min(startIndex + pageSize, length)
            : startIndex + pageSize;

        return `${startIndex + 1} - ${endIndex} / ${length}`;
    };

    return paginatorIntl;
}




