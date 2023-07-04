import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../data-service.service';

@Component({
  selector: 'app-bus-stop',
  templateUrl: './bus-stop.component.html',
  styleUrls: ['./bus-stop.component.css']
})
export class BusStopComponent implements OnInit, OnChanges {

  constructor(private resetter: DataService) { }

  @Input() busStops: any = {};
  @Input() mapInstance: any = {};
  @Output() selectEvent: EventEmitter<any> = new EventEmitter<any>();

  marker : any[] = [];
  stops = L.layerGroup();

  // https://stackoverflow.com/questions/7490660/converting-wind-direction-in-angles-to-text-words/54677081#54677081
  // answer by Matt Frear (September 16 2014, 11:02), modified
  degToCardinal = (num : any) => {
    if (Number.isNaN(num)) {
      return;
    }

    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[(val % 16)];
  }

  getSelectedStop(stop : any) {
    this.selectEvent.emit(stop);

    for (const busStop of this.busStops) {
      busStop.selected = 0;
    }
    for (const busStop of this.busStops) {
      if (busStop.gtfsId === stop.gtfsId) {
        busStop.selected = 1;
      }
    }
  }

  // https://stackoverflow.com/questions/9912145/leaflet-how-to-find-existing-markers-and-delete-markers
  // modified
  removeMarks(markerStore : any) {
    const map = this.mapInstance;
    /*
    for (let i = 0; i < markerStore.length; i++) {
      map.removeLayer(markerStore[i]);
    }
    */
    for (const mark of markerStore) {
      map.removeLayer(mark);
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.marker = [];

    const map = this.mapInstance;
    map.removeLayer(this.stops);

    for (const busStop of this.busStops) {
      // from https://github.com/pointhi/leaflet-color-markers
      const greenIcon = new L.Icon({
        iconUrl: 'assets/img/marker-icon-2x-green.png',
        shadowUrl: 'assets/img/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      const mark = L.marker([busStop.lat, busStop.lon], { icon: greenIcon }).bindPopup(`${busStop.name}, ${busStop.distance} m`);
      this.marker.push(mark);
    }

    this.stops = L.layerGroup(this.marker);
    map.addLayer(this.stops);

    if (this.resetter.resetter === 1) {
      this.busStops = [];
      map.removeLayer(this.stops);
      this.resetter.resetter = 0;
    }
  }

}