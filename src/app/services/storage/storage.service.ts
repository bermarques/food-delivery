import { Preferences } from '@capacitor/preferences';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  setStorage(key, value) {
    Preferences.set({ key: key, value: value });
  }

  async getStorage(key) {
    return Preferences.get({ key: key });
  }

  removeStorage(key) {
    Preferences.remove({ key: key });
  }

  clearStorage() {
    Preferences.clear();
  }
}
