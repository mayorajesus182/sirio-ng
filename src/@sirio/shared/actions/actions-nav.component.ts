import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SidenavItem } from 'src/app/layout/sidenav/sidenav-item/sidenav-item.interface';

@Component({
  selector: 'sirio-actions-nav',
  templateUrl: './actions-nav.component.html',
  styleUrls: ['./actions-nav.component.scss']

})
export class ActionsNavComponent implements OnInit {
  @Input('items') public items: Observable<SidenavItem[]>;
  @Input('element') public element: any = {};
  @Output() eventActionClicked = new EventEmitter();

  @Input('method') private method: MethodComponentApi
  menuItems: SidenavItem[] = [];
  constructor(
    private cdr: ChangeDetectorRef,


  ) { }
  ngOnInit(): void {

    this.items.subscribe(data => {
      this.menuItems = data;
      // console.log('actions ', data);
      this.cdr.markForCheck();

    });

  }

  callMethod(item:SidenavItem) {
    // console.log('click ', item);
    
    this.method.invoke({element:this.element,path:item.view}, item.functionName);
  }

  evalCondition(item) {
    if (!item.condition) {
      return true;
    }
    const stt = `${item.condition}`;
    return eval(stt);
  }

  applyColor(item) {

    if (!item.color) {
      return 'mat-color-primary';
    }

    let color = `${item.color}`;

    try {
      color = eval(color)
    } catch (error) {
      // no doing nothing
    }


    return 'mat-color-' + color;
  }

  getLabel(item) {

    let label = `${item.label}`;

    try {
      label = eval(label)
    } catch (error) {
      // no doing nothing
    }


    return label;
  }

}



export interface MethodComponentApi {
  invoke: (any, string) => void
}