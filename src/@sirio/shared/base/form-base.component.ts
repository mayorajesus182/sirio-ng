
import { Location } from "@angular/common";
import { HttpResponse } from "@angular/common/http";

import { ChangeDetectorRef, Component, ElementRef, Injector, QueryList, ViewChildren } from "@angular/core";
import { FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatButton } from "@angular/material/button";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { saveAs } from 'file-saver';
import { NgxSpinnerService, Spinner } from "ngx-spinner";
import { BehaviorSubject, fromEvent, Observable } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { NavigationService } from "src/@sirio/services/navigation.service";
import { SnackbarService } from "src/@sirio/services/snackbar.service";
import { SweetAlertService } from "src/@sirio/services/swal.service";
import { SidenavItem } from "src/app/layout/sidenav/sidenav-item/sidenav-item.interface";

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
        },
        {
            provide: "router", useClass: Router
        },
        {
            provide: "translateService", useClass: TranslateService
        }
    ]
})
export class FormBaseComponent {

    private _gap = 16;
    gap = `${this._gap}px`;
    col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
    col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;

    inputType = 'password';
    visible = false;
    public loaded$ = new BehaviorSubject<boolean>(false);

    progress: { percentage: number } = { percentage: 0 };
    public data: any;
    public loadingDataForm = new BehaviorSubject<boolean>(undefined);

    public loading$ = this.loadingDataForm.asObservable();


    protected snack: SnackbarService;
    protected navService: NavigationService;
    protected swalService: SweetAlertService;
    protected spinner: NgxSpinnerService;
    protected location: Location;
    protected translateService: TranslateService;
    protected router: Router;

    isNew: boolean = false;
    public itemForm: FormGroup;
    protected dialogRef: MatDialogRef<any>;
    public actions: SidenavItem[] = [];
    public buttons: SidenavItem[] = [];
    @ViewChildren(MatButton) buttonList: QueryList<MatButton>

    public opts = {
        type: 'line-scale-pulse-out',
        size: 'medium',
        fullScreen: false,
        color: '#5c6bc0',
        bdColor: 'rgba(190, 190, 190, 0.10)'
    } as Spinner;


    public phoneMask = { mask: ['(', /[0]/, /[2]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/], guide: false };
    public mobilePhoneMask = { mask: ['(', /[0]/, /[4]/, /[1-2]/, /[2,4,6]/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/], guide: false }


    // protected loadingSubject = new BehaviorSubject<boolean>(false);

    // public loading$ = this.loadingSubject.asObservable();


    colors = {
        REG: 'bg-success',
        VER: 'accent',
        VAL: 'accent',
        BLQ: 'bg-muted',
        ANU: 'bg-muted',
        APR: 'primary',
        ACT: 'primary'
    }



    constructor(protected dialog: MatDialog, injector: Injector) {


        this.navService = injector.get(NavigationService);
        this.spinner = injector.get(NgxSpinnerService);
        this.snack = injector.get(SnackbarService);
        this.swalService = injector.get(SweetAlertService);
        this.location = injector.get(Location);
        this.translateService = injector.get(TranslateService);
        this.router = injector.get(Router);

        this.opts.type = 'ball-scale-ripple-multiple';
        this.opts.size = 'medium';
        this.opts.fullScreen = false;
        this.opts.color = '#3f51b5';
        this.opts.bdColor = 'rgba(190, 190, 190, 0.10)';

        this.loading$.subscribe(status => {
            // console.log('send info ', status);
            
            // console.log('loading form-regla-OSCES ',status);
            // bloque todos los botonones mientras estoy enviando info al servidor
            if(this.buttonList){
                
                this.buttonList.forEach(element => {
                    element.disabled = status;
                });

            }
            if (status == true) {

                var opts = {} as Spinner;
                // opts.type = 'line-scale-pulse-out-rapid';
                opts.type = 'ball-scale-ripple-multiple';
                opts.size = 'medium';
                opts.fullScreen = false;
                opts.color = '#3f51b5';
                opts.bdColor = 'rgba(190, 190, 190, 0.15)';

                this.spinner.show('componentLoading', opts);
            } else {

                // console.log('loading hiden ', status);
                this.spinner.hide('componentLoading');
            }
        });



        // const injector = Injector.create({ providers: [
        //     { provide: SweetAlertService },
        //     { provide: TranslateService }
        // ] });

        // this.swalService = injector.get(SweetAlertService);

    }



    get d() {
        return this.data ? this.data : {};
    }

    get f() {
        return this.itemForm ? this.itemForm.controls : {};
    }




    protected updateData(current = {}) {
        Object.assign(current, this.itemForm.value);
    }

    protected updateDataFromValues(current = {}, values) {
        Object.assign(current, values);
    }


    protected showFormPopup(popupComponent, data: any, _isNew: boolean, withDialog = '60%'): MatDialogRef<any> {
        let data_aux = { payload: undefined, title: undefined, isNew: undefined };

        if (!data.payload) {
            data_aux.payload = data;
        } else {
            data_aux = data;
        }

        // data_aux.title = _title;
        data_aux.isNew = _isNew;

        this.dialogRef = this.dialog.open(popupComponent, {
            panelClass: 'dialog-frame',
            position: { top: '3%' },
            width: withDialog,
            disableClose: true,
            data: data_aux
        });

        return this.dialogRef;
    }

    protected showSimplePopup(popupComponent, title: string, data: any, withDialog = '50%') {

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




    protected errorResponse(errors, isNew: boolean = false) {
        this.loadingDataForm.next(false);
        this.snack.show({
            // message: 'No se pudo ' + (isNew ? ' crear ' : 'actualizar') + ' el elemento',
            message: `¡Operación rechazada!`,
            verticalPosition: 'bottom',
            type: 'danger'
        });
    }

    protected successResponse(entityName: string, event: string, notBack?: boolean) {

        this.loadingDataForm.next(false);
        if (!notBack) {
            this.location.back();
        }
        this.snack.show({
            // message: `${entityName} fue ${event} satisfactoriamente!`,
            message: `¡Operación realizada satisfactoriamente!`,
            verticalPosition: 'bottom'
        });
    }




    protected applyChangeStatus(service, element: any, content: string, changeDetector?: ChangeDetectorRef) {


        this.swalService.show(`message.${element.activo ? 'inactivateRecord' : 'activateRecord'}`, content).then((resp) => {


            if (!resp.dismiss) {

                service['changeStatus'](element.id, !element.activo).subscribe(data => {
                    this.snack.show({ message: '¡Estatus actualizado satisfactoriamente!', verticalPosition: 'bottom' });
                    element.activo = !element.activo;
                    changeDetector.detectChanges();
                });
            }

        });

    }



    public printErrors(): any[] {
        if (!this.itemForm || !this.itemForm.controls) {
            return null;
        }
        const result = [];
        Object.keys(this.itemForm.controls).forEach(key => {

            const controlErrors: ValidationErrors = this.itemForm.get(key).errors;
            if (controlErrors) {
                Object.keys(controlErrors).forEach(keyError => {
                    result.push({
                        'control': key,
                        'error': keyError,
                        'value': controlErrors[keyError]
                    });
                });
            }
        });
        // console.log("Errors:", result);
        return result;

    }

    protected applyFieldsDirty() {
        Object.keys(this.itemForm.controls).forEach(key => {
            this.itemForm.get(key).markAsDirty();
        });
    }

    protected applyFieldsDirtyTo(form: FormGroup) {
        Object.keys(form.controls).forEach(key => {
            this.itemForm.get(key).markAsDirty();
        });
    }


    protected saveOrUpdate(service, formData = {}, entityName, back = true, isNew?,): Observable<any> {
        this.loadingDataForm.next(true);
        if (this.isNew) {
            const saveRequest = service.save(formData);
            return saveRequest.subscribe(data => {
               //this.itemForm.reset({});
                // this.resetForm()
                this.successResponse(entityName, 'cread' + (entityName.indexOf('La') == 0 ? 'a' : 'o'), !back);

                return data;
            }, error => this.errorResponse(true));

        } else {
            const updateRequest = service.update(formData);
            return updateRequest.subscribe(data => {

                this.successResponse(entityName, 'actualizad' + (entityName.indexOf('La') == 0 ? 'a' : 'o'));
            }, error => this.errorResponse(true));
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


    public back() {
        this.location.back();
    }

    public backHome() {
        this.router.navigate(['/sirio/welcome']);
    }

    public resetForm(): void {
        if (this.itemForm) {

            //post send data to backend
            for (var name in this.itemForm.controls) {
                this.itemForm.get(name).setValue('');
                this.itemForm.get(name).clearValidators();
                // this.itemForm.get(name).updateValueAndValidity();

                this.itemForm.controls[name].setErrors(null);
            }

        }
    }

    protected resetFormOf(formData): void {
        if (formData) {

            //post send data to backend
            for (var name in formData.controls) {
                this.itemForm.get(name).setValue('');
                this.itemForm.get(name).clearValidators();
                // this.itemForm.get(name).updateValueAndValidity();

                this.itemForm.controls[name].setErrors(null);
            }

        }
    }


    protected addOrRemoveFieldValidator(fieldName: string, isAdd: boolean, value?: any, moreValidator?: any[]) {
        let validators = [Validators.required];
        if (moreValidator) {
            validators = validators.concat(moreValidator)
        }
        if (isAdd) {
            this.f[fieldName].setValidators(validators);
            this.f[fieldName].updateValueAndValidity();
            this.f[fieldName].setValue(value == undefined ? undefined : value);
        } else {
            this.f[fieldName].setValue(value == undefined ? undefined : value);
            this.f[fieldName].clearValidators();
            this.f[fieldName].updateValueAndValidity();
            this.f[fieldName].setErrors(undefined);
        }
    }


    protected toFormData(formValues: any): FormData {
        let formData = new FormData();

        for (const key of Object.keys(formValues)) {
            const value = formValues[key];
            formData.append(key, value);

        }

        return formData;
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

    eventFromElement(el: ElementRef, event) {
        if (!el) {
            return;
        }
        return fromEvent(el.nativeElement, event).pipe(
            distinctUntilChanged(),
            debounceTime(1000)
        );
    }

}

