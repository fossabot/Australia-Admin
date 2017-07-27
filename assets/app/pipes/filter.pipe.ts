import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'filter'})
export class filter implements PipeTransform {
    // public transform(input:string): string{
          transform(value: any, args: string[]): any {
        // if (!input) {
        //     return '';
        // } else {
        //     return input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase() ));
        // }

         let filter = args[1].toLocaleLowerCase();
       return filter ? value.filter(movie=> movie.title.toLocaleLowerCase().indexOf(filter) != -1) : value;
    }
    
}