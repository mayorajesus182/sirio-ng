import { AfterViewInit, OnInit, Component, Input } from "@angular/core";

@Component({
    selector: 'sirio-audit-bar',
    templateUrl: './audit-bar.component.html'
})
export class AuditBarComponent implements OnInit, AfterViewInit {
    @Input('element') public element: any = {};
    @Input('mode') public mode: string;

    disabled=false;

    ngAfterViewInit() {
        
    }
    ngOnInit() {
        
    }


}
