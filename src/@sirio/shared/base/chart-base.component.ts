import { HttpResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Component({
    template: ''
})
export class ChartBaseComponent {

    private download_label: string = 'Descargar ';
    private _gap = 16;
    gap = `${this._gap}px`;
    col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
    col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;

    lang = {
        downloadXLS: this.download_label +'Excel',
        decimalPoint: ',',
        downloadCSV: this.download_label + 'CSV',
        downloadJPEG: this.download_label + 'JPEG',
        downloadPDF: this.download_label + 'PDF',
        downloadPNG: this.download_label + 'PNG',
        downloadSVG: this.download_label + 'SVG',
        viewFullscreen: '[ ] Pantalla Completa',
        printChart: 'Imprimir'
    }



    protected loadingDataForm = new BehaviorSubject<boolean>(false);



    col(colAmount: number) {
        return `1 1 calc(${100 / colAmount}% - ${this._gap - (this._gap / colAmount)}px)`;
    }

    protected getFileName(response: HttpResponse<Blob>, ext?: string) {
        let filename: string;
        try {
            console.log('headers ', response.headers);
            // {
            //     "key": "",
            //     "value": [
            //         "attachment; filename=consulta_20210711_0132.xlsx"
            //     ]
            // }

            const contentDisposition: string = response.headers.get('content-disposition');
            console.log('content', contentDisposition);

            let i = contentDisposition.lastIndexOf('=');
            filename = contentDisposition.substring(i + 1);
        } catch (e) {

            filename = `reporte.${ext ? ext : 'xlsx'} `
        }
        return filename
    }

    protected download(fileName, blob) {
        console.log('archivo ' + fileName);

        this.writeContents(blob, fileName);
    }

    private writeContents(content, fileName) {
        var a = document.createElement('a');
        // var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(content);
        a.download = fileName;
        a.click();
    }
}