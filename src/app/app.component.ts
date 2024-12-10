import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../app/data-service.service';
import { API_KEY } from '../app/apikeys';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
    constructor(private resetter: DataService) { }

  title = 'angular-bus';

  // tslint:disable-next-line:max-line-length
  // https://tools.wmflabs.org/geohack/geohack.php?language=fi&pagename=Manner-Suomen_keskipiste&params=64.96_N_27.59_E_region:FI-09_type:landmark
  // as default values
  latitude = 64.96;
  longitude = 27.59;
  stops : any[] = [];
  map : any;
  maps : any;
  marker : any;
  selected = {};
  route = {};
  resetCheck = 0;
  repositioning = 0;

  // from https://stackoverflow.com/questions/11415106/issue-with-calculating-compass-bearing-between-two-gps-coordinates
  // modified
  bearing(lat1: number, lng1: number, lat2: number, lng2: number) {
    const dLon = (lng2 - lng1);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const brng = this.toDeg(Math.atan2(y, x));
    return 360 - ((brng + 360) % 360);
    }

   toDeg(rad: number) {
    return rad * 180 / Math.PI;
    }

    getNearestBusStops(lat: number, lon: number) {
        const DIGITRANSIT_URL = 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql';

        // query from https://digitransit.fi/en/developers/apis/1-routing-api/0-graphql/
        // modified
        const query = `
        {
            nearest(lat: ${lat}, lon: ${lon}, maxResults: 3, maxDistance: 100000, filterByPlaceTypes: [STOP]) {
                edges {
                    node {
                        place {
                            lat
                            lon
                            ...on Stop {
                                name
                                gtfsId
                                code
                            }
                        }
                        distance
                    }
                }
            }
        }
        `;

        fetch(DIGITRANSIT_URL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/graphql',
                'digitransit-subscription-key': API_KEY
            },
            body: query
        })
        .then(res => res.json())
        .then(data => {
            const places = data.data.nearest.edges;

            places.map((entry: { node: { place: any; distance: any; }; }) => {
                const location = entry.node.place;
                const entryDistance = entry.node.distance;

                const compass = this.bearing(lat, lon, location.lat, location.lon);

                // tslint:disable-next-line:max-line-length
                this.stops = [...this.stops, {name: location.name, code: location.code, gtfsId: location.gtfsId, lat: location.lat, lon: location.lon, distance: entryDistance, bearing: compass, selected: 0}];
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    displayLocation(position: any) {
        const lat : any = position.coords.latitude.toFixed(3);
        const lon : any = position.coords.longitude.toFixed(3);

        // testing coordinates, Oulu - Finland
        // lat = 65.016667;
        // lon = 25.466667;

        this.repositioning = 1;

        this.getNearestBusStops(lat, lon);
        this.marker.setLatLng([lat, lon]);
        this.map.panTo([lat, lon]);
        this.onMapReady(this.map);
    }

    onMapReady(map: L.Map) {
        setTimeout(() => {
          map.invalidateSize();
        }, 0);
    }

    selectedStop($event: {}) {
        this.repositioning = 0;
        this.resetCheck = 0;
        this.selected = $event;
    }

    selectedRoute($event: {}) {
        this.repositioning = 0;
        this.resetCheck = 0;
        this.route = $event;
    }

    // https://gis.stackexchange.com/questions/210041/using-leaflet-js-is-it-possible-to-know-the-onclick-location-of-a-marker-ignor/210102
    // modified
    clickedLocation($event: any) {
        const latlng = this.map.mouseEventToLatLng($event);
        const pos = {
            coords: {
                latitude: latlng.lat,
                longitude: latlng.lng
            }
        };
        this.stops = [];
        this.displayLocation(pos);
    }

    defaultView($event?: string | undefined) {
        if ($event && $event === 'reset') {
            this.map.remove();
            this.resetCheck = 1;
        }
        if ($event && $event === 'update') {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.repositioning = 1;
                    this.resetCheck = 0;

                    this.stops = [];
                    this.displayLocation(position);
                },
                (denied) => {
                    console.log('Not authorized by user.', denied);
                });
            }
            this.map.remove();
        }

        this.map = L.map('map').setView([this.latitude, this.longitude], 13);
        this.maps = this.map;
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // adding a scale indicator to map (lower left corner)
        const scale = L.control.scale().addTo(this.map);
        // scale.options.metric;

        // from https://github.com/pointhi/leaflet-color-markers
        const blueIcon = new L.Icon({
            iconUrl: 'assets/img/marker-icon-2x-blue.png',
            shadowUrl: 'assets/img/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        this.marker = L.marker([this.latitude, this.longitude], {icon: blueIcon}).addTo(this.map);
        this.marker.bindPopup('Your current location').openPopup();
    }
    ngOnInit() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.displayLocation(position);
            },
            (denied) => {
                console.log('Not authorized by user.', denied);
            });
        }
        this.defaultView();
    }
}