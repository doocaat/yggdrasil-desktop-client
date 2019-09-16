import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: any, ...args: any[]): number {
    return Math.round(value);
  }

}
