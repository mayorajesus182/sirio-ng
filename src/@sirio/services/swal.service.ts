import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';




@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  constructor(
    public translate: TranslateService
  ) { }


  private opts: SweetAlertOptions = {
    title: '',
    text: '',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '',
    cancelButtonText: '',
    html: undefined,
  };

  show(title: string, txt?: string, opts: any = {}) {

    let opts_warning = {
      title: this.translate.instant(title),
      confirmButtonText: this.translate.instant('button.confirm'),
      cancelButtonText: this.translate.instant('button.cancel'),
      text: txt ? this.translate.instant(txt) : ''
    }
    let options = {};
    if (opts.icon != 'success' && opts.icon!='error') {
      options = Object.assign({}, this.opts, opts_warning, opts);

    } else {

      let opts_success = {
        title: this.translate.instant(title),
        confirmButtonText: this.translate.instant('button.ok'),
        text: txt ? this.translate.instant(txt) : ''
      }
      options = Object.assign({}, opts_success, opts);
    }

    //options = Object.assign({},this.opts,opts);
    //console.log(options);
    return Swal.fire(options);
  }

}