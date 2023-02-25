import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listFilter'
})
export class ListFilterPipe implements PipeTransform {
  transform(elements: any[], keywords: string,atributo: string): any[] {
    if (!keywords) {
      return elements;
    }

    keywords = keywords.toLowerCase();
    return elements.filter((elem) => {
      const valorAtributo = elem[atributo].toLowerCase();
      return valorAtributo.includes(keywords);
    });
  }
}
