import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(time: string, utcOffset: number): any {
    return this.adjustForTimezone(time, utcOffset);
  }

  adjustForTimezone(arg: string, utcOffset: number): any {
    let localDate :Date = new Date(arg);
    localDate.setHours(localDate.getHours() + utcOffset);

    let isDST = this.isDaylightSavingTime(localDate);
    console.log('isDST '+ isDST);
    return this.convertMillisToCurrentTimezone(localDate.getTime());
  }

  convertMillisToCurrentTimezone(gmt4Millis: any) {
    // Get the current timezone offset in hours
    let currentTimezoneOffsetHours = new Date().getTimezoneOffset() / 60;

    // Calculate the offset between GMT-4 and the current timezone in hours
    let offsetHours = (-4 + currentTimezoneOffsetHours);

    // Convert the offset to milliseconds
    let offsetMillis = offsetHours * 60 * 60 * 1000;



    return this.formatDate(new Date(gmt4Millis - offsetMillis));
  }

  isDaylightSavingTime(date: Date): boolean {
    const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    return Math.max(jan, jul) !== date.getTimezoneOffset();
  }


  formatDate(date: Date) {
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0
    let yyyy = date.getFullYear();

    let HH = String(date.getHours()).padStart(2, '0');
    let MM = String(date.getMinutes()).padStart(2, '0');

    return dd + '/' + mm + '/' + yyyy + '\n ' + HH + ':' + MM;
  }
}
