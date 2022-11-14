import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-lost',
  templateUrl: './session-lost.component.html',
  styleUrls: ['./session-lost.component.scss']
})
export class SessionLostComponent implements OnInit {

  constructor(public location:Location) { }

  ngOnInit() {
  }

}
