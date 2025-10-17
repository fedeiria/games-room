import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchText'
})
export class SearchTextPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase().trim();

    //obtengo todos los valores del objeto item y mapeo cada valor a una cadena de texto a minusculas
    return items.filter((item) => {
      const searchString = Object.values(item)
        .map(value => {
          if (value ===  null || typeof value === 'undefined') {
            return '';
          }
          if (typeof value === 'object') {
            return Object.values(value).join(' ');
          }
          return String(value);
        })
        .join(' ')
        .toLowerCase();

      // verifico si la cadena de busqueda esta incluida en la cadena combinada del item 
      return searchString.includes(searchText);
    });
  }
}
