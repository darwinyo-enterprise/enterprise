import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      this.storage = sessionStorage;
    }
  }
  public retrieve(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      const item = this.storage.getItem(key);

      if (item && item !== 'undefined') {
        return JSON.parse(this.storage.getItem(key));
      }
    }
    return;
  }

  public store(key: string, value: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage.setItem(key, JSON.stringify(value));
    }
  }
}
