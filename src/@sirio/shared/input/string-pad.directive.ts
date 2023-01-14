import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { FormControl } from "@angular/forms";

@Directive({
    selector: '[stringPad], [string-pad]'
 })
 export class StringPadDirective {
    @Input() left: boolean = true;
    @Input() numCeros: number;
    @Input() caracter: string = '0';
    @Input() control: FormControl;
 
    @HostListener('blur') onBlur() {
       let value: string = this.element.nativeElement.value;
       if (this.left) {
          this.element.nativeElement.value = value.padStart(this.numCeros, this.caracter);
       } else {
          this.element.nativeElement.value = value.padEnd(this.numCeros, this.caracter);
       }
       this.control.setValue(this.element.nativeElement.value);
    }
    
    constructor(private element: ElementRef) {}
 }
