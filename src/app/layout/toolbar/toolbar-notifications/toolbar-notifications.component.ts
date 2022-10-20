import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  //TODO: esto debo obtenerlo de un colsolidado por usuario de tareas
  total: number=2;

  constructor() {
  }

  ngOnInit() {
   
  }

}
