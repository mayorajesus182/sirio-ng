import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { ReferenciaPersonal, ReferenciaPersonalService } from 'src/@sirio/domain/services/persona/referencia-personal/referencia-personal.service';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { ReferenciaPersonalFormPopupComponent } from '../popup/referencia-personal-form.popup.component';



@Component({
  selector: 'sirio-persona-referencia-personal-table',
  templateUrl: './referencia-personal-table.component.html',
  styleUrls: ['./referencia-personal-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class ReferenciaPersonalTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  @Input() persona = undefined;
  @Input() onRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output('propagar') propagar: EventEmitter<number> = new EventEmitter<number>();

  referencias: string[] = [];
  referenciaPersonalList: ReplaySubject<ReferenciaPersonal[]> = new ReplaySubject<ReferenciaPersonal[]>();

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected referenciaPersonalService: ReferenciaPersonalService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }

  private loadList() {
    this.referencias = []
    this.referenciaPersonalService.allByPersonaId(this.persona).subscribe((data) => {
      // console.log(data);
      
      this.referenciaPersonalList.next(data.slice());
      this.referencias = this.referencias.concat(data.map(t => t.identificacion));
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

  delete(row) {
    this.swalService.show('¿Desea Eliminar Referencia Personal de?', undefined,
      { 'html': ' <b>' + row.nombre + '</b>' }).then((resp) => {
        if (!resp.dismiss) {
          this.referenciaPersonalService.delete(row.id).subscribe(val => {
            if (val) {
              this.loadList();
            }
          })
          this.cdr.detectChanges();
        }
      });
  }

  ngAfterViewInit() {

  }

  popup(data?: ReferenciaPersonal) {
    if (data) {
      data.persona = this.persona;
    }
    this.showFormPopup(ReferenciaPersonalFormPopupComponent, !data ? { persona: this.persona, referencias: this.referencias } : { ...data, ...{ referencias: this.referencias } }, '40%').afterClosed().subscribe(event => {
      if (event) {
        this.onRefresh.next(true);
      }
    });
  }
}