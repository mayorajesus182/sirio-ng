import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
    selector: '[tabNavigation]'
})
export class TabNavigationDirective {

    constructor(private el: ElementRef) { }

    ngAfterViewInit() {
        const firstTabbableElement = this.el.nativeElement.querySelector('input:not([disabled]):not([readonly]), select:not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly]), button:not([disabled]), mat-select:not([disabled])');
        if (firstTabbableElement) {
          firstTabbableElement.focus();          
        }
      }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
       
        const tabKeyCode = 'Tab';
        const tabbableElements = this.el.nativeElement.querySelectorAll('input:not([disabled]):not([readonly]), select, textarea, button:not([disabled]), radio, checkbox, mat-select:not([disabled])');

        const lastTabbableElement = tabbableElements[tabbableElements.length - 1];
        const firstTabbableElement = tabbableElements[0];

        if (event.key == tabKeyCode) {
            // console.log('input firts', firstTabbableElement);
            // console.log('input last', lastTabbableElement);

            if (event.shiftKey && document.activeElement === firstTabbableElement) {
                lastTabbableElement.focus();
                event.preventDefault();
            } else if (!event.shiftKey && document.activeElement === lastTabbableElement) {
                firstTabbableElement.focus();
                event.preventDefault();
            }
        }
    }
}