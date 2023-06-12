import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    return date.toLocaleDateString();
  }
}