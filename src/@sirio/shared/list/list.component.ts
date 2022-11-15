import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'sirio-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements AfterViewInit {

  @Input() name: string;
  @Input() placeholder: string;
  // @Input() columns: ListColumn[];

  @ViewChild('filter') filter: ElementRef;
  @Output() filterChange = new EventEmitter<string>();

  @Input() hideHeader: boolean;

  constructor(private location: Location) {
  }

  ngAfterViewInit() {
    if (!this.hideHeader) {
      fromEvent(this.filter.nativeElement, 'keyup').pipe(
        distinctUntilChanged(),
        debounceTime(250)
      ).subscribe(() => {
        this.filterChange.emit(this.filter.nativeElement.value);
      });
    }
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  public back() {
    this.location.back();
  }
}
