import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'sirio-toolbar-quickpanel-toggle',
  templateUrl: './toolbar-quickpanel-toggle.component.html',
  styleUrls: ['./toolbar-quickpanel-toggle.component.scss']
})
export class ToolbarQuickpanelToggleComponent {

  @Output() openQuickPanel = new EventEmitter();

  constructor() {
  }

  goStatistics(){

  }
}
