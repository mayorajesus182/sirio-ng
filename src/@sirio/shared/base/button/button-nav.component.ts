import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavigationService } from 'app/shared/services/navigation.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-button-nav',
  templateUrl: './button-nav.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonNavComponent implements OnInit, OnDestroy {
  
  buttons: any[]=[];

  @Input()
  method: ButtonComponentApi

  constructor(private cdr: ChangeDetectorRef,
    private router: Router,
    private navService: NavigationService) {

    // console.log(this.buttons);


  }
  ngOnInit(): void {


    if (this.router) {

      const url = this.router.url;
      this.navService.getButtons(url).subscribe(data => {
        this.buttons = data;
        // console.log('buttons ', data);
        this.cdr.markForCheck();

      });
    }



  }
  ngOnDestroy(): void {

  }

  callMethod(name: string) {
    this.method.invoke(name);
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



export interface ButtonComponentApi {
  invoke: (string) => void
}