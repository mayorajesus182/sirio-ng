import { Component, Input, HostListener, ElementRef, OnInit, AfterViewInit, forwardRef, ViewChild, ChangeDetectionStrategy, OnDestroy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from "@angular/forms";
import { MatSelect } from '@angular/material/select';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';




@Component({
    selector: 'sirio-select-search',
    templateUrl: './select-search.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectSearchComponent),
            multi: true
        }
    ]
})
export class SelectSearchComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {

    @Input() errors;
    @Input() label: string;
    @Input() icon: string;
    @Input() attributeName: string;
    @Input() required: boolean = false;
    @Input() readonly: boolean = false;
    @Input() multiple: boolean = false;
    @Input('elements') public items: Observable<any[]>;
    public disabled: boolean = false;
    
    public selected: any | null = null;

    public selectSearchControl: FormControl;


    /** control for the MatSelect filter keyword */
    public filterCtrl: FormControl = new FormControl();
    // public elements: any[] = [];

    @ViewChild('searchSelect') singleSelect: MatSelect;

    private _onDestroy = new Subject<void>();
    /** list of elements filtered by search keyword */
    public filteredElements: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    @HostListener('change', ['$event'])
    changeSelect(event: any) {
        console.log(event);

        // const file = event && event.item(0);
        // this.onChange(file);
        // this.selected = file;
    }

    constructor(private host: ElementRef<HTMLInputElement>) {


    }
    ngAfterViewInit(): void {
        this.filteredElements
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {

                // this.singleSelect.compareWith = (a: any, b: any) => { return a && b && a.id === b.id };
                if(this.singleSelect){

                    this.singleSelect.compareWith = (a: any, b: any) => {
                        // console.log('A ',a);
                        // console.log('B ',b);
    
                        if (!a || !b) {
                            return false;
                        }
                        // if(Object.keys(a.id).length > 0 && Object.keys(b.id).length > 0){
                        //     // console.log('A keys ',Object.keys(a.id));
                        //     // console.log('B keys',Object.keys(b.id));
                        //     const key1 = Object.keys(a.id)[0]; 
                        //     const key2 = Object.keys(a.id)[1]; 
    
                        //     // asumo que la clave compuesta es de 2 campos
                        //     return Object.keys(a.id)[0]==Object.keys(b.id)[0] && a.id[key1]== b.id[key1] && Object.keys(a.id)[1]==Object.keys(b.id)[1] && b.id[key2] == a.id[key2];
                        // }    
                        return a === b;
    
                    };
                }
            });


        if (this.items) {

            this.items.subscribe(data => {

                if (!data || data.length == 0) {
                    this.filteredElements.next([]);
                    return;
                }
                // console.log('lista ', data);


                let elements = data;
                //console.log('request service ',this.requestService);


                // load the initial element list
                this.filteredElements.next(elements.slice());


                // listen for search field value changes
                this.filterCtrl.valueChanges
                    .pipe(takeUntil(this._onDestroy))
                    .subscribe(() => {
                        this.filterElement(data);
                    });

            });

        }


        this.selectSearchControl.valueChanges.subscribe((data) => {

            if (!this.disabled) {
                //console.log('propagar', data);

                this.propagateChange(data);
            }


            if (data == '') {
                this.selectSearchControl.clearValidators();
                // this.selectControl.updateValueAndValidity();
            }
        });


    }
    ngOnInit(): void {

        const validators = [];

        this.selectSearchControl = new FormControl('');

    }

    ngOnDestroy() {
        // this.subscriptions.forEach(s => s.unsubscribe());
    }

    // onChange: any = () => { };
    // onTouched: any = () => { };

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    
    registerOnTouched(fn) {
        this.propagateTouched = fn;
    }

    writeValue(value) {
        if (value) {
            this.selectSearchControl.setValue(value);
        }

        if (value === null || value == undefined) {
            this.selectSearchControl.reset();
        }
    }

    // communicate the inner form validation to the parent form
    validate(_: FormControl) {
        return this.selectSearchControl.valid ? null : { profile: { valid: false } };
    }

    /**
     * Function registered to propagate a change to the parent
     */
    public propagateChange: any = () => { };

    /**
     * Function registered to propagate touched to the parent
     */
    public propagateTouched: any = () => { };
    
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }


    private filterElement(data: any[]) {
        if (!data || data.length == 0) {
            return;
        }
        // get the search keyword
        let search = this.filterCtrl.value;
        if (!search || search.length == 0) {
            this.filteredElements.next(data.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredElements.next(
            data.filter(elem => elem[this.attributeName].toLowerCase().indexOf(search) >= 0)
        );
    }


    showName(valSelected:any){
        let name = '';
        if(valSelected){
            this.items.subscribe(data=>name =data.filter(d=>d.id===valSelected).map(d=>d[this.attributeName])[0]);
        }
        return name;
    }

}
