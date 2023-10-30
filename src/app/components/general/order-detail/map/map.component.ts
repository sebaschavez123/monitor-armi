import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import {icon, latLng, LeafletMouseEvent, Map, MapOptions, Marker, marker, tileLayer} from 'leaflet';
import { environment } from '../../../../../environments/environment';
declare var ol: any;

@Component({
  selector: 'open-street-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {

  homeMarker: Marker;
  storeMarker: Marker;
  messengerMarker: Marker;
  pinMarker: Marker;

  @Input() coordinates;
  @Input() coordinatesEdit;
  @Input() store:any;
  @Input() home:any;
  @Input() style:any;
  @Input() sizeGl:boolean = false;
  @Input() active:boolean;
  @Input() edit:boolean = false;
  @Output() change = new EventEmitter();
  map: Map;
  mapPoint: any;
  options: MapOptions;
  lastLayer: any;

  constructor () {
  }

  ngOnInit () {
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();
    this.map?.invalidateSize(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.map) {
      if( changes.store) this.createMarkerStore();
      if( changes.home) { this.createMarkerHome(); }
      if( this.map && (changes.coordinates || changes.coordinatesEdit)){
        console.log('cambiando coordenadas mansejaro onchhange', this.coordinates, this.coordinatesEdit);
        this.setMessengerCoordinates(this.coordinates || this.coordinatesEdit);
      }
      this.createMarkers();
      this.map.invalidateSize(true);
    }
  }

  initializeMap (map: Map) {
    this.map?.remove();
    this.map = map;
    if(this.edit) {
      this.map.on('click',  (e) => this.clickMap(e));
      this.map.on('dragend',() => this.dragendMap());
    }
    this.storeMarker = null;
    this.homeMarker = null;
    this.messengerMarker = null;
    this.pinMarker = null;
    this.createMarkers();
  }

  clickMap(e: LeafletMouseEvent) : void {
    console.log(e);
    const latitude  = e.latlng.lat.toFixed(5);
    const longitude  = e.latlng.lng.toFixed(5);
    this.coordinatesEdit = {longitude, latitude};
    this.createPinMarker();
    this.goto(this.coordinatesEdit);
    this.change.emit(this.coordinatesEdit);
  }
  
  goto(coords) {
    if(this.map && coords) {
      this.map.setView(latLng([coords.latitude, coords.longitude]), this.map.getZoom());
      this.map.invalidateSize(true);
    }
  }

  dragendMap() { /* se necesita para activar el arrate del mapa */  }

  private initializeMapOptions () {
    const coords = latLng(
      this.coordinatesEdit?.latitude ?? this.coordinates?.latitude ?? this.store?.latitude ?? environment.coordinates[0],
      this.coordinatesEdit?.longitude ?? this.coordinates?.longitude ?? this.store?.longitude ?? environment.coordinates[1]
    )
    this.options = {
      center: coords,
      zoom: this.sizeGl ? 22 : 12,
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

  private initializeDefaultMapPoint () {
    this.mapPoint = {
      name: 'Hello',
      latitude: this.store?.latitude ?? this.coordinatesEdit?.latitude ?? this.coordinates?.latitude ?? environment.coordinates[0],
      longitude: this.store?.longitude ?? this.coordinatesEdit?.longitude ?? this.coordinates?.longitude ?? environment.coordinates[1]
    };
  }

  private createMarkers() {
    //this.clearMap();
    console.log('omap => creando marcadores', {
      map: !!this.map,
      store: !!this.store,
      home: !!this.home,
    });
    if(this.map) {
      console.log([this.store,this.home]);
      this.createMarkerStore();
      this.createMarkerHome();
      this.createMessengerMarker(); // marcador mensajero!
      this.createPinMarker();
      this.map?.invalidateSize(true);
    }
  }

  private createMarkerStore () {
    if(this.store) {
      if(!this.storeMarker) {
        const mapIcon = icon({
          iconSize: [41, 41],
          iconAnchor: [13, 41],
          iconUrl: '/assets/images/tienda.png'
        });
        const coordinates = latLng([this.store.latitude, this.store.longitude]);
        this.storeMarker = marker(coordinates).setIcon(mapIcon);
        this.storeMarker.addTo(this.map);
        this.map.setView(coordinates, this.map.getZoom());
      } 
    }
  }

  private createMarkerHome () {
    if(!this.home) return;
    const coordinates = latLng([this.home.latitude, this.home.longitude]);
    if(!this.homeMarker) {
      const mapIcon = icon({
        iconSize: [41, 41],
        iconAnchor: [13, 41],
        iconUrl: '/assets/images/casa.png'
      });
      this.homeMarker = marker(coordinates).setIcon(mapIcon);
      this.homeMarker.addTo(this.map);
    } else {
      if(!this.edit){
        this.homeMarker?.setLatLng(coordinates);
      }
    }
  }

  private createMessengerMarker (coords = null) {
    if(!this.coordinates || !this.store) return;
    if(this.coordinates?.latitude === 0) return;
    const coordinates = latLng([
      this.coordinates?.latitude,
      this.coordinates?.longitude
    ]);
    if(!this.messengerMarker) {
      const messengerIcon = icon({
        iconSize: [ this.sizeGl ? 40 : 31, this.sizeGl ? 40 : 31],
        iconAnchor: [this.sizeGl ? 20: 13, this.sizeGl ? 71: 41],
        iconUrl: `/assets/images/moto.png`
      });
      console.warn('creando el mensajero!', [this.coordinates?.latitude, this.coordinates?.longitude]);
      this.messengerMarker = marker(coords || coordinates).setIcon(messengerIcon);
      this.messengerMarker.addTo(this.map);
    } else {
      this.messengerMarker?.setLatLng(coords || coordinates);
    }
  }

  createPinMarker() {
    if(this.edit) {
      const mapPin = icon({
        iconSize: [ this.sizeGl ? 40 : 31, this.sizeGl ? 60 : 31],
        iconAnchor: [this.sizeGl ? 20: 13, this.sizeGl ? 71: 41],
        iconUrl: `/assets/images/pin.png`
      });
      const coords = latLng([this.coordinatesEdit.latitude,this.coordinatesEdit.longitude]);
      if(!this.pinMarker) {
        this.pinMarker = marker(coords, {draggable: this.edit}).setIcon(mapPin);
        /*this.pinMarker.on('dragend', console.log);
        this.pinMarker.on('moveend', (e:any)=> {
          console.log('e:drag', e);
          const latitude  = e.latlng.lat.toFixed(5);
          const longitude  = e.latlng.lng.toFixed(5);
          this.coordinatesEdit = {longitude, latitude};
          this.pinMarker?.setLatLng(coords);
          //this.map?.invalidateSize(true);
          //setTimeout(() => this.map.setView(this.coordinatesEdit, this.map.getZoom()), 1200);
          this.change.emit(this.coordinatesEdit);
        });*/
        this.pinMarker.addTo(this.map);
      }
      if(this.coordinatesEdit?.latitude && this.coordinatesEdit?.longitude) {
        this.pinMarker?.setLatLng(coords);
      }
    }
  }

  setMessengerCoordinates(coords) {
    if(!coords) return;
    const coordinates = latLng([coords.latitude, coords.longitude]);
    this.createMessengerMarker(coordinates);
    const before = this.messengerMarker?.getLatLng();
    //const distance = this.getGeoDistance(before.lat, before.lng, coords.latitude, coords.longitude);
  }

  get styleMap():any {
    return {
      ...this.style,
      'display': this.coordinates || this.coordinatesEdit ? 'block':'none'
    }
  }

  private getGeoDistance(latitude1, longitude1, latitude2, longitude2) {
    const degToRad = (deg) => deg * (Math.PI / 180.0);
    const radToDeg = (deg) => (Math.PI * 180.0) / deg;
    const theta = longitude1 - longitude2; 
    let distance = (Math.sin(degToRad(latitude1)) * Math.sin(degToRad(latitude2))) + (Math.cos(degToRad(latitude1)) * Math.cos(degToRad(latitude2)) * Math.cos(degToRad(theta))); 
    distance = Math.acos(distance); 
    distance = radToDeg(distance);
    distance = distance * 60 * 1.1515; 
    distance = distance * 1.609344;
    return (Math.round(distance)); 
  }

}
