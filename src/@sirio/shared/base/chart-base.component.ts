import { HttpResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { BehaviorSubject } from "rxjs";

@Component({
    template: ''
})
export class ChartBaseComponent {

    protected _chartOptionsSubject = new BehaviorSubject<Highcharts.ChartOptions>(undefined);
    chartOptions$ = this._chartOptionsSubject.asObservable();

    private download_label: string = 'Descargar ';
    private _gap = 16;
    gap = `${this._gap}px`;
    col2 = `1 1 calc(50% - ${this._gap / 2}px)`;
    col3 = `1 1 calc(33.3333% - ${this._gap / 1.5}px)`;

    lang = {
        downloadXLS: this.download_label + 'Excel',
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


// export function getPaginatorIntl() {
//     const paginatorIntl = new MatPaginatorIntl();

//     paginatorIntl.itemsPerPageLabel = '';
//     paginatorIntl.nextPageLabel = 'Pag. siguiente';
//     paginatorIntl.previousPageLabel = 'Pag. anterior';
//     paginatorIntl.lastPageLabel = 'Última pag.';
//     paginatorIntl.firstPageLabel = 'Primera pag.';

//     paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
//         if (length === 0 || pageSize === 0) {
//             return `0 / ${length}`;
//         }

//         length = Math.max(length, 0);

//         const startIndex: number = page * pageSize;
//         const endIndex: number = startIndex < length
//             ? Math.min(startIndex + pageSize, length)
//             : startIndex + pageSize;

//         return `${startIndex + 1} - ${endIndex} / ${length}`;
//     };

//     return paginatorIntl;
// }