import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('map', { static: true }) mapElementRef: ElementRef;
  googleMaps: any;
  map: any;
  marker: any;
  center = { lat: -32.020624834560465, lng: -52.10440742972138 };

  constructor(
    private maps: GoogleMapsService,
    private renderer: Renderer2,
    private locationService: LocationService
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
  }

  async initMap() {
    try {
      const position = await this.locationService.getCurrentPosition();
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      await this.loadMap();
    } catch (err) {}
  }

  async loadMap() {
    try {
      let googleMaps: any = await this.maps.loadGoogleMaps();
      this.googleMaps = googleMaps;
      const style = [
        {
          featureType: 'all',
          elementType: 'all',
          stylers: [{ saturation: -100 }],
        },
      ];
      const mapEl = this.mapElementRef.nativeElement;
      const location = new googleMaps.LatLng(this.center.lat, this.center.lng);
      this.map = new googleMaps.Map(mapEl, {
        center: location,
        zoom: 15,
        scaleControl: false,
        streetViewControl: false,
        zoomControl: false,
        overviewMapControl: false,
        mapTypeControl: false,
        mapTypeControlOptions: {
          mapTypeIds: [googleMaps.MapTypeId.ROADMAP, 'foodDelivery'],
        },
      });
      var mapType = new googleMaps.StyledMapType(style, { name: 'Grayscale' });
      this.map.mapTypes.set('foodDelivery', mapType);
      this.map.setMapTypeId('foodDelivery');
      this.renderer.addClass(mapEl, 'visible');
      this.addMarker(location);
    } catch (e) {
      console.log(e);
    }
  }

  addMarker(location) {
    let googleMaps: any = this.googleMaps;
    const icon = {
      url: 'assets/icons/location-pin.png',
      scaledSize: new googleMaps.Size(50, 50),
    };
    this.marker = new googleMaps.Marker({
      position: location,
      map: this.map,
      icon: icon,
      draggable: true,
      animation: googleMaps.Animation.DROP,
    });
  }
}
