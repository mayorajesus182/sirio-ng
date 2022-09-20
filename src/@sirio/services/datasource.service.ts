import { DataSource } from "@angular/cdk/table";
import { BehaviorSubject, of, Observable } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { CollectionViewer } from "@angular/cdk/collections";



export class DatasourceService implements DataSource<any> {

    private dataSubject = new BehaviorSubject<any[]>([]);

    public totalElements = 0;

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    public paramsOpts:any;

    constructor(private currentService: any, private method?: string) {

    }

    loadData(filter: any,
        sortPropertie: string,
        sortDirection: string,
        pageIndex: number,
        pageSize: number) {

        this.loadingSubject.next(true);

        if (!this.method) {

            this.currentService.page(filter, sortPropertie, sortDirection,
                pageIndex, pageSize,this.paramsOpts).pipe(
                    catchError(() => of([])),
                    finalize(() => this.loadingSubject.next(false))
                )
                .subscribe(data => {
                    // console.log(data);
                    
                    this.dataSubject.next(data.content);
                    this.totalElements = data.totalElements;
                });

        } else {
            this.currentService[this.method](filter, sortPropertie, sortDirection,
                pageIndex, pageSize,this.paramsOpts).pipe(
                    catchError(() => of([])),
                    finalize(() => this.loadingSubject.next(false))
                )
                .subscribe(data => {
                    this.dataSubject.next(data.content);
                    this.totalElements = data.totalElements;
                });

        }

    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        //console.log("Connecting data source... ");
        return this.dataSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.dataSubject.complete();
        this.loadingSubject.complete();
    }


    getData(){
        return this.dataSubject.getValue();
    }

}

