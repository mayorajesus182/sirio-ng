import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'sirio-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements AfterViewInit {
  private isOpen: boolean;
  @Input() name: string;
  @Input() placeholder: string;
  @Input() tooltipStats: string = undefined;
  @Input() icon_btn: string = 'file-pdf';
  @Input() showBottonHelper: boolean = false;
  @Input() filterEnabled: boolean = false;
  // @Input() columns: ListColumn[];

  @ViewChild('filter') filter: ElementRef;

  @Output() filterChange = new EventEmitter<string>();

  @Output() bottonClick = new EventEmitter<boolean>();

  @Output() btnOpenFilter = new EventEmitter<boolean>();

  @Input() hideHeader: boolean;

  constructor(private location: Location, private router: Router) {
  }

  ngAfterViewInit() {
    if (!this.hideHeader) {
      fromEvent(this.filter.nativeElement, 'keyup').pipe(
        distinctUntilChanged(),
        debounceTime(500)
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

  public backHome() {
    this.router.navigate(['/sirio/welcome']);
  }



  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.btnOpenFilter.emit(this.isOpen);
    
  }
  
  onClickOutside() {
    this.btnOpenFilter.emit(false);
  }
}
