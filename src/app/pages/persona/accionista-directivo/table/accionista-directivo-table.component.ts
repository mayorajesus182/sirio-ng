import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { AccionistaDirectivo, AccionistaDirectivoService } from 'src/@sirio/domain/services/persona/accionista-directivo/accionista-directivo.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { AccionistaDirectivoFormPopupComponent } from '../popup/accionista-directivo-form.popup.component';

@Component({
  selector: 'sirio-persona-accionista-directivo-table',
  templateUrl: './accionista-directivo-table.component.html',
  styleUrls: ['./accionista-directivo-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class AccionistaDirectivoTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();
  @Input() persona = undefined;
  @Input() onRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  accionistaDirectivoList: ReplaySubject<AccionistaDirectivo[]> = new ReplaySubject<AccionistaDirectivo[]>();

  porcentajeAccionario: number = 0;

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected accionistaDirectivoService: AccionistaDirectivoService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList() {
    this.porcentajeAccionario = 0
    this.accionistaDirectivoService.allByPersonaId(this.persona).subscribe((data) => {
      this.porcentajeAccionario = data.length > 0 ? data.map(t => t.porcentaje | 0).reduce((a, b) => a + b) : 0;
      this.accionistaDirectivoList.next(data.slice());
      this.propagar.emit(data.length);
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
    this.swalService.show('¿Desea Eliminar Accionistas / Junta Directiva: ?', undefined,
      { 'html': ' <b>' + row.nombre + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          this.accionistaDirectivoService.delete(row.id).subscribe(val => {
            if (val) {
              this.loadList();
            }
          })
          this.cdr.detectChanges();
        }
      });
  }
  popup(data?: AccionistaDirectivo) {
    if (data) {
      data.persona = this.persona;
    }
    this.showFormPopup(AccionistaDirectivoFormPopupComponent, !data ? { persona: this.persona, porcentajeAccionario: this.porcentajeAccionario } : data, '70%').afterClosed().subscribe(event => {
      if (event) {
        this.onRefresh.next(true);
      }
    });
  }
}