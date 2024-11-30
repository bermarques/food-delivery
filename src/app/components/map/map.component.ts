import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { GoogleMapsService } from 'src/app/services/google-maps.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElementRef: ElementRef;
  googleMaps: any;
  map: any;

  constructor(private maps: GoogleMapsService, private renderer: Renderer2) {}

  ngOnInit() {
    this.loadMap();
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
      const location = new googleMaps.LatLng(
        -32.020624834560465,
        -52.10440742972138
      );
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
    } catch (e) {
      console.log(e);
    }
  }
}
