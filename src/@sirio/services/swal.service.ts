import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import  Swal, { SweetAlertOptions } from 'sweetalert2';




@Injectable({
  providedIn: 'root',
})
export class SweetAlertService {
  constructor(
    public translate: TranslateService
  ) { }


  private opts:SweetAlertOptions = {
    title:'',
    text:'',
    icon:'warning',
    showCancelButton: true,
    confirmButtonColor: '#fc594e',
    confirmButtonText: '',
    cancelButtonText: '',
    html:undefined,
  };

  show(title: string, txt?: string, opts:any={}) {

    let opts_aux = {
      title:this.translate.instant(title),
      confirmButtonText: this.translate.instant('button.confirm'),
      cancelButtonText: this.translate.instant('button.cancel'),
      text:txt?this.translate.instant(txt):''
    }

    let options = Object.assign({},this.opts,opts_aux,opts);;
    //options = Object.assign({},this.opts,opts);
    //console.log(options);
    return Swal.fire(options);
  }

}