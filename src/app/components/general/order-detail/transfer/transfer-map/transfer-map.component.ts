import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { icon, latLng, Map, MapOptions, Marker, marker, Point, tileLayer } from 'leaflet';
import { environment } from 'src/environments/environment';
import { HomeCoordinates, StoreCoordinates } from './models/transfer-map';

@Component({
  selector: 'app-transfer-map',
  templateUrl: './transfer-map.component.html',
  styleUrls: ['./transfer-map.component.scss']
})
export class TransferMapComponent implements OnInit {

  @Input() home: HomeCoordinates;
  @Input() stores: StoreCoordinates[];
  @Input() size: number = 0;
  @Input() 
    set updateMap(value: boolean) {
      if(value) setTimeout(() => { this.createMarkers() }, 200);
    };
  
  map: Map;
  options: MapOptions;
  layers: Marker[] = [];

  ngOnInit () {
    this.initializeMapOptions();
    this.map?.invalidateSize(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.map && (changes.size || changes.store || changes.stores || changes.home)) {
      this.createMarkers();
    }
    this.map?.invalidateSize(true);
  }

  initializeMap (map: Map) {
    this.map = map;
    this.createMarkers();
  }

  private initializeMapOptions () {
    this.options = {
      center: latLng(
        environment.coordinates[0],
        environment.coordinates[1],
      ),
      zoom: 22,
      zoomSnap: 0.5,
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 18,
            attribution: 'Map data © OpenStreetMap contributors'
          })
      ],
    }
  }

  private createMarkers() {
    this.clearMap();
    if(this.home) this.createMarkerHome();
    if(this.stores) this.stores.forEach((store, index) => {
      this.createMarkerStore(store, index);
    });

    let coordinatesZoom = [];
    if(this.home) coordinatesZoom.push([this.home?.latitude, this.home?.longitude]);
    if(this.stores) this.stores.forEach(store => coordinatesZoom.push([store?.latitude, store?.longitude]));
    
    setTimeout(() => {
      if(coordinatesZoom?.length) this.map.fitBounds(coordinatesZoom, {padding: new Point(15, 15)});
    }, 200);
    
    this.map?.invalidateSize(true);
  }

  private createMarkerStore (store: StoreCoordinates, index: number) {
    const mapIcon = icon({
      iconSize: [41, 41],
      iconAnchor: [13, 41],
      iconUrl: '/assets/images/tienda.png'
    });
    const coordinates = latLng([store?.latitude, store?.longitude]);
    const lastLayer = marker(coordinates).setIcon(mapIcon).addTo(this.map);
    if(store?.storeName && store?.storeId && store?.storeAddress) {
      const html = `
        <div style="text-align: center; line-height: 1; margin: -8px -15px">
          <h5 style="margin: 0">${index + 1}</h5>
          <p style="margin: 0">${store?.storeName}</p>
          <p style="margin: 0">Tienda ${store?.storeId}</p>
          <p style="margin: 0">${store?.storeAddress}</p>
        </div>
      `;
      lastLayer.bindPopup(html, {offset: new Point(10, -30)});
    }
    this.layers?.push(lastLayer);
    this.map.setView(coordinates, this.map.getZoom());
  }

  private createMarkerHome () {
    const mapIcon = icon({
      iconSize: [41, 41],
      iconAnchor: [13, 41],
      iconUrl: '/assets/images/casa.png'
    });
    const coordinates = latLng([this.home?.latitude, this.home?.longitude]);
    const lastLayer = marker(coordinates).setIcon(mapIcon).addTo(this.map);
    if(this.home?.address) {
      const html = `
        <div style="text-align: center; line-height: 1; margin: -8px 0px">
          <h6 style="margin: 0">Dirección cliente</h6>
          <p style="margin: 0">${this.home?.address}</p>
        </div>
      `;
      lastLayer.bindPopup(html, {offset: new Point(10, -30)});
    }
    this.layers?.push(lastLayer);
    this.map.setView(coordinates, this.map.getZoom());
  }

  private clearMap () {
    this.layers?.forEach(layer => {
      if (!!layer && this.map?.hasLayer(layer)){
        this.map?.removeLayer(layer);
      }
    });
  }
}
