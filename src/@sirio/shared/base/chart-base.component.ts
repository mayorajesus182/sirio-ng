import { Component } from "@angular/core";

@Component({
    template: ''
})
export class ChartBaseComponent {

    private _gap = 16;
    gap = `${this._gap}px`;
    col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
    col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;


    col(colAmount: number) {
        return `1 1 calc(${100 / colAmount}% - ${this._gap - (this._gap / colAmount)}px)`;
    }
}