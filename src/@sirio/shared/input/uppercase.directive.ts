import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener, Input, Renderer2,
  Self
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';




@Directive({
  selector: '[uppercase],[upper-case]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UppercaseDirective),
      multi: true
    }
  ]
})
export class UppercaseDirective implements ControlValueAccessor {
  private subscription: Subscription;

  onChange: (value: string) => void;
  onTouched: () => void;

  constructor(private el: ElementRef,private _renderer: Renderer2) {}

  ngOnInit() {
    this.subscription = fromEvent(this.el.nativeElement, 'keyup')
      .subscribe((event: any) => {
        // console.log(event);
        
        // const value = event.target.value;
        // this.el.nativeElement.value = value.toUpperCase();
        // this.onChange(value);
        const value = event.target.value;
        const cursorStart = this.el.nativeElement.selectionStart;
        const cursorEnd = this.el.nativeElement.selectionEnd;
        this.el.nativeElement.value = value.toUpperCase();
        this.el.nativeElement.setSelectionRange(cursorStart, cursorEnd);
        // this._renderer.setProperty(this.el.nativeElement, 'value', value.toUpperCase());
        this.onChange(value.toUpperCase());

      });
  }

  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  writeValue(value: string): void {
    if(!value){
      this._renderer.setProperty(this.el.nativeElement, 'value', '');
    }else{
      this._renderer.setProperty(this.el.nativeElement, 'value', value.toUpperCase());
    }

  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}



// @Directive({
//   selector: '[uppercase]',
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => UppercaseDirective),
//       multi: true,
//     },
//   ],
// })
// export class UppercaseDirective implements ControlValueAccessor {
//   /** implements ControlValueAccessorInterface */
//   _onChange: (_: any) => void;

//   /** implements ControlValueAccessorInterface */
//   _touched: () => void;

//   constructor(@Self() private _el: ElementRef, private _renderer: Renderer2) { }

//   /** Trata as teclas */
//   @HostListener('keyup', ['$event'])
//   onKeyDown(evt: KeyboardEvent) {
//     // console.log(evt);

//     const value = this._el.nativeElement.value.toUpperCase();
//     this._renderer.setProperty(this._el.nativeElement, 'value', value);
//     this._onChange(value);
//     evt.preventDefault();

//   }

//   @HostListener('blur', ['$event'])
//   onBlur() {
//     this._touched();
//   }

//   /** Implementation for ControlValueAccessor interface */
//   writeValue(value: any): void {
//     this._renderer.setProperty(this._el.nativeElement, 'value', value);
//   }

//   /** Implementation for ControlValueAccessor interface */
//   registerOnChange(fn: (_: any) => void): void {
//     this._onChange = fn;
//   }

//   /** Implementation for ControlValueAccessor interface */
//   registerOnTouched(fn: () => void): void {
//     this._touched = fn;
//   }

//   /** Implementation for ControlValueAccessor interface */
//   setDisabledState(isDisabled: boolean): void {
//     this._renderer.setProperty(this._el.nativeElement, 'disabled', isDisabled);
//   }
// }