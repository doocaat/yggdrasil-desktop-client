import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import * as momentDurationFormatSetup from 'moment-duration-format';

@Pipe({
  name: 'durationHumanize'
})
export class DurationPipe implements PipeTransform {
  constructor() {
    momentDurationFormatSetup(moment);
  }

  transform(value: any, ...args: any[]): any {
    
    return moment
      .duration(value, 'seconds')
      // @ts-ignore
      .format();

      /*
       'y [y], w [w], d [d], h [hr], m [min], s [sec]',
        {
          minValue: 1,
          largest: 3,
          trim: "all",
        }*/
  }
}
