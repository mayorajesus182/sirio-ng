import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sirio-inbox-navigation',
  templateUrl: './inbox-navigation.component.html',
  styleUrls: ['./inbox-navigation.component.scss']
})
export class InboxNavigationComponent implements OnInit {

  @Input() responsive: boolean;

  constructor() {
  }

  ngOnInit() {
  }

}
