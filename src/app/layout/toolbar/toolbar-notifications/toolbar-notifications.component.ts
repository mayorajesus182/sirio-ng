import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Injector, OnInit, Output } from '@angular/core';
import { WorkflowService } from 'src/@sirio/domain/services/workflow/workflow.service';
import { LIST_FADE_ANIMATION } from '../../../../@sirio/shared/list.animation';

@Component({
  selector: 'sirio-toolbar-notifications',
  templateUrl: './toolbar-notifications.component.html',
  styleUrls: ['./toolbar-notifications.component.scss'],
  animations: [...LIST_FADE_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarNotificationsComponent implements OnInit {

  @Output() openQuickPanel = new EventEmitter();

  isOpen: boolean;
  total: number = 0;

  constructor(
    injector: Injector,
    protected workflowService: WorkflowService,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    
    this.workflowService.pendingQuantity().subscribe(data => {
      this.total = data;
      this.cdr.detectChanges();
    });
  }

}
5