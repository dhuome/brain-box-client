/* eslint-disable no-magic-numbers */
import { Pipe, PipeTransform } from '@angular/core';

interface Intervals {
  [key: string]: number;
}

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) { return ''; }

    const date = new Date(value);
    const seconds = Math.floor((+new Date() - + date) / 1000);

    // define intervals with explicit type
    const intervals: Intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    let counter;

    // handle less than a second
    if (seconds < 1) {
      return 'just now';
    }

    // eslint-disable-next-line id-length
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      if (counter > 0) {
        if (counter === 1) {
          return `${counter} ${i} ago`; // singular
        }
        return `${counter} ${i}s ago`; // plural
      }
    }

    return value;
  }
}
