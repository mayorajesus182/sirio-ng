import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, forwardRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatSelect } from '@angular/material/select';
import { Observable, ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";


@Component({
    selector: 'sirio-select-simple',
    templateUrl: './select-simple.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectSimpleComponent),
            multi: true
        }
    ]
})
export class SelectSimpleComponent implements ControlValueAccessor, OnInit,AfterViewInit, OnDestroy {

    @Input() errors;
    @Input() label: string;
    @Input() icon: string;
    @Input() attributeName: string;
    @Input() required: boolean = false;
    @Input() readonly: boolean = false;
    @Input('elements') public items: Observable<any[]>;
    public disabled: boolean = false;
    
    public selected: any | null = null;

    public selectControl: FormControl;
    

    @ViewChild('singleSelect') singleSelect: MatSelect;

    private _onDestroy = new Subject<void>();
    /** list of elements filtered by search keyword */
    public filteredElements: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    @HostListener('change', ['$event'])
    changeSelect(event: any) {
        // console.log(event);

        // const file = event && event.item(0);
        // this.onChange(file);
        // this.selected = file;
    }

    constructor(private host: ElementRef<HTMLInputElement>,private cdr: ChangeDetectorRef) {
        // Si el componente se está usando como control de formulario
        // if (this.ngControl) {
        //     this.ngControl.valueAccessor = this;
        // }

    }
    ngAfterViewInit(): void {
        this.filteredElements
            .pipe(take(1), takeUntil(this._onDestroy))
            .subscribe(() => {

                // this.singleSelect.compareWith = (a: any, b: any) => { return a && b && a.id === b.id };
                
                this.singleSelect.compareWith = (a: any, b: any) => {

                    if (!a || !b) {
                        return false;
                    }

                    // if (Object.keys(a.id).length > 0 && Object.keys(b.id).length > 0) {
                    //     // console.log('A keys ',Object.keys(a.id));
                    //     // console.log('B keys',Object.keys(b.id));


                    //     const key1 = Object.keys(a.id)[0];
                    //     const key2 = Object.keys(a.id)[1];

                    //     // asumo que la clave compuesta es de 2 campos
                    //     return Object.keys(a.id)[0] == Object.keys(b.id)[0] && a.id[key1] == b.id[key1] && Object.keys(a.id)[1] == Object.keys(b.id)[1] && b.id[key2] == a.id[key2];
                    // }
                    return a === b;
                };
                //this.multiSelect.compareWith = (a: Bank, b: Bank) => a.id === b.id;
            
            });


            setTimeout(()=>{

                this.selectControl.clearValidators();
                this.selectControl.markAsPristine();

                if(this.errors&&this.errors.length>0){
                    this.selectControl.markAsTouched();
                    this.selectControl.setErrors({'invalid':true});
                    this.selectControl.markAsDirty();
                    this.cdr.markForCheck()
                }
                // console.log('errors ',this.errors);
                
            },3000)

            this.selectControl.valueChanges.subscribe((data) => {
    
                if (!this.disabled) {
                    // console.log('propagar', data);
    
                    this.propagateChange(data);
                }
    
    
                if (data == '' || data== undefined) {
                    this.selectControl.clearValidators();
                    // this.selectControl.updateValueAndValidity();
                }
            });

    }
    ngOnInit(): void {

        const validators = [];

        this.selectControl = new FormControl('');

        if (this.items) {
            this.items.subscribe(data => {
                let elements = data;
                // console.log('request  ',data);


                // load the initial element list
                this.filteredElements.next(elements.slice());


            });

        }
        

    }


    ngOnDestroy() {
        // this.subscriptions.forEach(s => s.unsubscribe());
    }



    onChange: any = () => { };
    onTouched: any = () => { };

    /**
     * Function registered to propagate a change to the parent
     */
    public propagateChange: any = () => { };

    /**
     * Function registered to propagate touched to the parent
     */
    public propagateTouched: any = () => { };
    /**
       * ControlValueAccessor Interface Methods to be implemented
       */
    writeValue(value: any): void {
        if (value) {
            this.selectControl.setValue(value);
        }            
       
        if (value === null || value== undefined) {
            this.selectControl.reset();
        }
    }


    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    
    registerOnTouched(fn) {
        this.propagateTouched = fn;
    }

   

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    validate(_: FormControl) {
        return this.selectControl.valid ? null : { profile: { valid: false } };
    }

}
