import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { fadeInUpAnimation } from 'src/@sirio/animations/fade-in-up.animation';
import { fadeInRightAnimation } from 'src/@sirio/animations/fade-in-right.animation';
import { TableBaseComponent } from 'src/@sirio/shared/base/table-base.component';
import { AgenciaService } from 'src/@sirio/domain/services/organizacion/agencia.service';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { Workflow } from 'src/@sirio/domain/services/workflow/workflow.service';

@Component({
  selector: 'app-tareas-table',
  templateUrl: './tareas-table.component.html',
  styleUrls: ['./tareas-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInRightAnimation, fadeInUpAnimation]
})

export class TareasTableComponent extends TableBaseComponent implements OnInit, AfterViewInit {

  displayedColumns = ['expediente_id', 'rol_id', 'descripcion', 'publicacion', 'acciones'];

  constructor(
    injector: Injector,
    protected dialog: MatDialog,
    protected router: Router,
    protected workflowService: WorkflowService,
    private cdr: ChangeDetectorRef,
  ) {
    super(undefined, injector);
  }


  ngOnInit() {
    this.init(this.workflowService, 'expediente_id', 'pageByUsuarioRols');
  }

  ngAfterViewInit() {
    this.afterInit();
  }

  takeTask(task: Workflow) {
    let mensaje = task.expediente.concat(' - ').concat(task.rolNombre);
    this.swalService.show('¿Desea Tomar la Tarea?', mensaje).then((resp) => {
      if (!resp.dismiss) {
        this.workflowService.take(task.id).subscribe(data => {
          this.snack.show({ message: 'Tarea Asignada Satisfactoriamente!', verticalPosition: 'bottom' });
        });
      }
    });
  }

  solveTask(tarea: Workflow) {
    let mensaje = tarea.expediente.concat(' - ').concat(tarea.rolNombre);
    this.swalService.show('¿Desea Resolver la Tarea?', mensaje).then((resp) => {
      if (!resp.dismiss) {
        console.log('allaaaaaaaaaaaaaaaaaaaaaaaaaa');
      }
    });
  }


}
