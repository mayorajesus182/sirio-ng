import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: '[sirioDisableZoom],[sirio-disable-zoom]'
})
export class DisableZoomDirective {
  constructor(private element: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log('keydown event ', event);
    if (event.ctrlKey && (event.code === 'NumpadAdd' || event.code === 'NumpadSubtract')) {
      
      event.preventDefault();
    }
  }
  
  
  @HostListener('keydown.ctrl.+', ['$event'])
  @HostListener('keydown.ctrl.-', ['$event'])
  onKeyDown2(event: KeyboardEvent) {
    console.log('keydown2 event ', event);
    event.preventDefault();
  }


  @HostListener('mousewheel', ['$event'])
  onMousewheel(event: WheelEvent) {
    if (event.ctrlKey) {
      // console.log('mousewheel event ',event);
      event.preventDefault();
    }
  }
}