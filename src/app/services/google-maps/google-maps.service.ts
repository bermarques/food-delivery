import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  googleMaps: any;
  private _places = new BehaviorSubject([]);
  private _markerChange = new BehaviorSubject<any>({});

  get places() {
    return this._places.asObservable();
  }

  get markerChange() {
    return this._markerChange.asObservable();
  }

  constructor(private http: HttpClient, private zone: NgZone) {}

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

  getAddress(lat: number, lng: number) {
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

  async getPlaces(query: string) {
    try {
      if (!this.googleMaps) {
        this.googleMaps = await this.loadGoogleMaps();
      }
      const service = new this.googleMaps.places.AutocompleteService();
      service.getPlacePredictions({ input: query }, (predictions) => {
        const places = [];
        predictions?.forEach(async (prediction) => {
          const { lat, lng }: any = await this.geoCode(
            prediction.description,
            this.googleMaps
          );
          const place = {
            location_name: prediction.structured_formatting.main_text,
            address: prediction.description,
            lat,
            lng,
          };
          places.push(place);
        });
        this._places.next(places);
      });
    } catch (err) {
      throw err;
    }
  }

  geoCode(address, googleMaps) {
    return new Promise((resolve, reject) => {
      const geocoder = new googleMaps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          resolve({ lat: location.lat(), lng: location.lng() });
        } else {
          reject(new Error('Geocoder failed due to: ' + status));
        }
      });
    });
  }

  changeMarkerInMap(location) {
    this._markerChange.next(location);
  }
}
