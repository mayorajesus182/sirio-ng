import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject, Subject } from 'rxjs';


import { Router } from '@angular/router';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Usuario, UsuarioService } from 'src/@sirio/domain/services/autorizacion/usuario.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';


@Component({
  selector: 'app-usuario-table',
  templateUrl: './usuario-table.component.html',
  styleUrls: ['./usuario-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})
export class UsuarioTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {
  protected loadingData = new BehaviorSubject<boolean>(false);
  test: string;
  unsubscribeAll: Subject<any>;
  displayedColumns = ['usuario_id', 'nombre', 'identificacion','ente', 'email', 'ldap', 'prev_login', 'activo', 'actions'];

  constructor(

    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  ngOnInit() {
    this.init(this.usuarioService, 'usuario_id');
  }


  ngAfterViewInit() {
    this.afterInit();
  }


  add(path:string) {
    this.router.navigate([`${this.buildPrefixPath(path)}/add`]);
  }

  edit(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/edit`]);
  }

  view(data:any) {
    this.router.navigate([`${this.buildPrefixPath(data.path)}${data.element.id}/view`]);
  }

  generateKey(element: Usuario) {

    // if (!element || !element.id) {
    //   return;
    // }

    // this.swalService.show('title.alert.confirmation', `Generar nueva contraceña para ${element.id} `).then((resp) => {

    //   if (!resp.dismiss) {
    //     this.loadingData.next(true);

    //     this.usuarioService.generatePasswd(element.id).subscribe(result => {
    //       this.loadingData.next(false);
    //       this.snack.show({
    //         message: 'La contraña fue generada satisfactoriamente!',
    //         verticalPosition: 'bottom'
    //       });

    //     }, error => {

    //       this.loadingData.next(false);
    //       this.snack.show({
    //         message: 'Los cambios no pudieron ser aplicados!',
    //         verticalPosition: 'bottom',
    //         type: 'danger'
    //       });
    //     })


    //   }

    // });

  }

  activateOrInactivate(data:any) {
    this.applyChangeStatus(this.usuarioService, data.element, data.element.nombre, this.cdr);
  }

}

