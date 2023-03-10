import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { Direccion, DireccionService } from 'src/@sirio/domain/services/persona/direccion/direccion.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { DireccionFormPopupComponent } from '../popup/direccion-form.popup.component';
import { GlobalConstants } from 'src/@sirio/constants';
import { PersonaConstants } from 'src/@sirio/constants/persona.constants';


@Component({
  selector: 'sirio-persona-direccion-table',
  templateUrl: './direccion-table.component.html',
  styleUrls: ['./direccion-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class DireccionTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Input() persona = undefined;
  @Input() onRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  direcciones: ReplaySubject<Direccion[]> = new ReplaySubject<Direccion[]>();
  direccionList: Direccion[] = [];
  private principal: boolean = false;
  cantidadDirecciones: number = 0;
  direccionPrincipal = PersonaConstants.DIRECCION_PRINCIPAL;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected direccionService: DireccionService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList() {
    this.direccionService.allByPersonaId(this.persona).subscribe((data) => {
      this.cantidadDirecciones = data.length;
      this.direcciones.next(data.slice());
      this.propagar.emit(data.length);
      this.principal = data.filter(d => d.tipoDireccion == this.direccionPrincipal).length > 0;
      this.cdr.detectChanges();
    });
  }

  ngOnInit() {
    if (this.persona) {
      this.loadList();
      this.onRefresh.subscribe(val => {
        if (val) {
          this.loadList();
        }
      })
    }
  }

  ngAfterViewInit() {

  }

  delete(row) {
    this.swalService.show('??Desea Eliminar Direcci??n?', undefined,
      { 'html': ' <b>' + row.descripcion + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          this.direccionService.delete(row.id).subscribe(val => {
            if (val) {
              this.loadList();
            }
          })
          this.cdr.detectChanges();
        }
      });
  }

  popup(data?: Direccion) {

    if (data) {
      data.persona = this.persona;
    }
    this.updateDataFromValues(data, { principal: this.principal });
    let dir = data;
    this.showFormPopup(DireccionFormPopupComponent, !data ? { persona: this.persona, principal: this.principal, primero: this.cantidadDirecciones == 0 ? true : false } : dir, '80%').afterClosed().subscribe(event => {
      if (event) {
        this.onRefresh.next(true);
      }
    });
  }



}