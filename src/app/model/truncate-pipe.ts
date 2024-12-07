import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'truncate'})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number): string {
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}

@Pipe({standalone: true, name: 'camelCaseSplit'})
export class CamelCasePipe implements PipeTransform {

  transform(camelCase: string): string {
    let ccSplit = camelCase.split(/(?=[A-Z])/).join(" ")
    return ccSplit;
  }

}
