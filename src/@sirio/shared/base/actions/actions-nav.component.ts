import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, NavigationService } from 'app/shared/services/navigation.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-actions-nav',
  templateUrl: './actions-nav.component.html'
})
export class ActionsNavComponent implements OnInit {
  @Input('items') public items: Observable<MenuItem[]> ;
  @Input('element') public element: any = {};

  @Input('method') private method: MethodComponentApi
  menuItems:MenuItem[]=[];
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private navService: NavigationService

  ) { }
  ngOnInit(): void {
    
    if (this.router) {

      const url = this.router.url;
      this.items.subscribe(data => {
         this.menuItems= data;
        // console.log('actions ', data);
        this.cdr.markForCheck();

      });
    }
  }

  callMethod(name: string) {
    this.method.invoke(this.element, name);
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