import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  constructor(private http: HttpClient) {}

  loadGoogleMaps() {
    const win = window as any;
    const gModule = win.google;

    if (gModule && gModule.maps) {
      return Promise.resolve(gModule.maps);
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Map SDK is not available');
        }
      };
    });
  }

  getAdress(lat: number, lng: number) {
    return new Promise<any>((resolve, reject) => {
      this.http
        .get<any>(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.GOOGLE_MAPS_API_KEY}`
        )
        .pipe(
          map((geoData) => {
            if (!geoData || !geoData.results || !geoData.results[0]) throw null;
            return geoData.results[0];
          })
        )
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (e) => {
            reject(e);
          },
        });
    });
  }
}
