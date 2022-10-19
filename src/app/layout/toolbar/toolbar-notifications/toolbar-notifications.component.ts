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
  notifications: any[];
  isOpen: boolean;
  total: number=2;

  constructor() {
  }

  ngOnInit() {
   
  }

}
