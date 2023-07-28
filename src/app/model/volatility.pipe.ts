import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'volatility'
})
export class VolatilityPipe implements PipeTransform {

  private readonly volatilitiesMap: Record<string, string> = {
    '*': '🔥',
    '**': '🔥🔥',
    '***': '🔥🔥🔥',
  };

  transform(value: string): string {
    return this.volatilitiesMap[value] || value;
  }
}
