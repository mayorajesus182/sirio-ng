import { Component, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, NgForm, Validators, ValidationErrors } from '@angular/forms';
import * as _moment from 'moment';
import { saveAs } from 'file-saver';
import { SnackbarService } from '../../services/snackbar.service';
import { SweetAlertService } from '../../services/swal.service';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import {MatTabGroup} from '@angular/material/tabs'
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ColumnMode } from '@swimlane/ngx-datatable';
@Component({
    template: '',
    providers: [
        {
            provide: "snack", useClass: SnackbarService
        },
        {
            provide:"swalService", useClass:SweetAlertService
        },
        {
            provide: "spinner", useClass: NgxSpinnerService
        },
        {
            provide: "router", useClass: Router
        }
    ]
})
export class PopupBaseComponent {
    public ColumnMode = ColumnMode;
    // isNew=true;
    mode: 'global.add' | 'global.edit' = 'global.add';
    @ViewChild('tabGroup') tabGroup: MatTabGroup;
    @ViewChild('formData') formData: NgForm;
    @ViewChild(MatProgressBar) progressBar: MatProgressBar;
    @ViewChildren(MatButton) buttons: QueryList<MatButton>
    public itemForm: FormGroup;

    protected loadingDataForm = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingDataForm.asObservable();


    protected snack: SnackbarService;
    protected swalService: SweetAlertService;
    protected spinner: NgxSpinnerService;
    protected router: Router;

    public phoneMask = {mask:['(', /[0]/,/[2]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],guide:false};
    public mobilePhoneMask= {mask:['(',/[0]/,/[4]/, /[1-2]/, /[2,4,6]/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],guide:false}

    colors={
        REG:'bg-success',
        VER:'accent',
        VAL:'accent',
        BLQ:'bg-red',
        ANU:'bg-red',
        APR:'primary',
        ACT:'primary'
    }

    constructor(
        public dialogRef: MatDialogRef<any>,
        protected injector: Injector,
        protected dialog?: MatDialog
    
        ) {
        
            this.spinner = injector.get(NgxSpinnerService);
            this.snack = injector.get(SnackbarService);
            this.swalService = injector.get(SweetAlertService);
            this.router = injector.get(Router);
        // this.phoneMask = ['(', /[0]/, /[1-2]/, /[1-9]/, /[1-9]/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
        // this.mobilePhoneMask = ['(', /[0]/, /[4]/, /[1-2]/, /[1-6]/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    }

    get isNew():boolean{
        return this.mode === 'global.add'?true:false;
    }

    protected download(fileName, blob) {
        // console.log('archivo-saldo ' + fileName);

        /*let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        link.click();*/

        saveAs(blob, fileName);
    }

    protected updateData(current = {}) {
        Object.assign(current, this.itemForm.value);
    }

    protected updateDataItemForm(current = {},itemForm:FormGroup) {
        Object.assign(current, itemForm.value);
    }

    protected onEventSend(event) {
        this.progressBar.mode = event ? 'indeterminate' : 'determinate';

        this.buttons.forEach(element => {
            element.disabled = event;
        });
    }

    protected errorResponse(isNew: boolean = false) {
        if(this.progressBar){

            this.progressBar.mode = 'determinate';
        }

        this.buttons.forEach(element => {
            element.disabled = false;
        });
        this.loadingDataForm.next(false);
        // this.snack.show({
        //     message: 'No se pudo ' + (isNew ? ' crear ' : 'actualizar') + ' el elemento',
        //     verticalPosition: 'bottom',
        //     type: 'danger'

        // });
        this.snack.show({
            // message: 'No se pudo ' + (isNew ? ' crear ' : 'actualizar') + ' el elemento',
            message: `¡Operación rechazada!`,
            verticalPosition: 'bottom',
            type: 'danger'
        });
    }

    protected errorResponseCustomMessage(isNew: boolean = false,text:string) {
        this.progressBar.mode = 'determinate';

        this.buttons.forEach(element => {
            element.disabled = false;
        });

        this.snack.show({
            message: text,
            verticalPosition: 'bottom',
            type: 'danger'

        });
    }

    protected errorResponseFileUpload(errors, swal?: SweetAlertService) {

        this.buttons.forEach(element => {
            element.disabled = false;
        });

        if (swal) {

            let data_html = '<ul>' + errors.map(function (err) {
                return '<li>' + err + '</li>';
            }).join('') + '</ul>';

            swal.show('title.error.file.upload', 'text.info.message', { type: "error", html: data_html, showConfirmButton: false, cancelButtonText: 'Cerrar' }).then((resp) => {
                //return false;
            });
        }

    }

    protected filterObjectList(keyword: any, fromList: any[], toList: ReplaySubject<any[]>) {
        


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

    protected successResponse(entityName: string, event: string, noClose?: boolean) {
        if(this.progressBar){
            this.progressBar.mode = 'determinate';
        }

        this.buttons.forEach(element => {
            element.disabled = false;
        });

        if (this.formData) {

            this.formData.resetForm({});
        }

        if (!noClose) {

            this.dialogRef.close(true);
        }

    this.loadingDataForm.next(false);
        // this.snack.show({
        //     message: `${entityName} fue ${event} satisfactoriamente!`,
        //     verticalPosition: 'bottom'
        // });
        this.snack.show({
            // message: `${entityName} fue ${event} satisfactoriamente!`,
            message: `¡Operación realizada satisfactoriamente!`,
            verticalPosition: 'bottom'
        });

    }

    protected successResponseFileUpload(entityName: string, event: string, noClose?: boolean) {


        this.buttons.forEach(element => {
            element.disabled = false;
        });


        if (!noClose) {

            this.dialogRef.close(true);
        }

        // this.snack.show({
        //     message: `${entityName} fue ${event} satisfactoriamente!`,
        //     verticalPosition: 'bottom'
        // });

        this.snack.show({
            // message: `${entityName} fue ${event} satisfactoriamente!`,
            message: `¡Operación realizada satisfactoriamente!`,
            verticalPosition: 'bottom'
        });

    }


    get f() {
        return this.itemForm.controls;
    }


    public printErrors():any[] {
        if(!this.itemForm || !this.itemForm.controls){
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

    protected saveOrUpdate(service, formData = {}, entityName, isNew?) {


        if(this.progressBar){
            this.progressBar.mode = 'indeterminate';
        }


        this.buttons.forEach(element => {
            element.disabled = true;
        });

this.loadingDataForm.next(true);
        if (this.isNew) {
            service.save(formData)
                .subscribe(data => this.successResponse(entityName, 'cread' + (entityName.indexOf('La') == 0 ? 'a' : 'o')), error => this.errorResponse(true));
        } else {
            service.update(formData)
                .subscribe(data => this.successResponse(entityName, 'actualizad' + (entityName.indexOf('La') == 0 ? 'a' : 'o')), error => this.errorResponse(false));
        }

    }


    protected saveOrUpdateWithoutClosed(service, childComponent, formData = {}, entityName) {

        this.progressBar.mode = 'indeterminate';

        this.buttons.forEach(element => {
            element.disabled = true;
        });
        var isNew = childComponent['isNew'];
        if (isNew) {
            service.save(formData).subscribe(data => {
                this.successResponse(entityName, isNew ? 'creada' : 'actualizada', true);
                childComponent['initForm']();
                
            }, error => this.errorResponse(true));
        } else {
            service.update(formData).subscribe(data => {
                this.successResponse(entityName, isNew ? 'creada' : 'actualizada', true);
                childComponent['initForm']();
                
            }, error => this.errorResponse(false));
        }

    }


    protected showSimplePopup(popupComponent, title, data, withDialog = '50%') {

        return this.dialog.open(popupComponent, {
            panelClass: 'form-regla-OSCES-dialog',
            width: withDialog,
            disableClose: true,
            data: { title: title, payload: data }
        });
    }



    public excludeWeekends(date: _moment.Moment) {
        var day = date.weekday();
        //var day = date.getDay();
        //console.log(' date ',day);
        return day !== 5 && day !== 6;
    };

    public compareObjects(a: any, b: any) {
        if (a && b && a.id == b.id) {
            return true;
        } else {
            return false
        }
    }


    public validateCharacter(event){
        
        // console.log(event);
        console.log('reg expresion result');
        console.log(new RegExp(/[a-zA-Z0-9\u00C0-\u017F\u0022-\u0023\u0026-\u0029\u002C-\u002E]$/).test(event.key));
        return new RegExp(/[a-zA-Z0-9\u00C0-\u017F\u0022-\u0023\u0026-\u0029\u002C-\u002E]$/).test(event.key);
        
    }

    protected toFormData(formValues: any): FormData {
        const formData = new FormData();

        for (const key of Object.keys(formValues)) {
            const value = formValues[key];
            formData.append(key, value);

        }

        return formData;
    }

    protected addOrRemoveFieldValidator(fieldName:string,isAdd:boolean,value?:any,moreValidator?:any[]){
        let validators = [Validators.required];
        if(moreValidator){
            validators =  validators.concat(moreValidator)
        }
        this.f[fieldName].setValue(value == undefined ? undefined :  value);
        if(isAdd){
            this.f[fieldName].setValidators(validators);
            this.f[fieldName].updateValueAndValidity();
        }else{                        
            // this.f[fieldName].setValue(undefined);
            this.f[fieldName].clearValidators();
            this.f[fieldName].updateValueAndValidity();
            this.f[fieldName].setErrors(undefined);
        }
    }

}
