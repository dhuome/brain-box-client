import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private history: string[] = [];
  private readonly ROOT_URL = '/';

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  back() {
    // eslint-disable-next-line no-magic-numbers
    if (this.history.length > 0) {
      this.history.pop();
      this.location.back();
    } else {
      this.router.navigateByUrl(this.ROOT_URL);
    }
  }
}
