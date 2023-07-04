import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DateTime } from 'luxon';
import { DataService } from '../data-service.service';
import { API_KEY } from '../apikeys';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit, OnChanges {

  @Input() stop: any = {};
  @Input() routeTimeTable: any = {};
  timetable: any = [];
  selectedStop: any = {};

  constructor(private resetter: DataService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.stop.gtfsId) {
      this.selectedStop = this.stop.gtfsId;
      this.updateTimeTable(this.stop.gtfsId);
    }
  }

  updateTimeTable(stopID : any) {
    const DIGITRANSIT_URL = 'https://api.digitransit.fi/routing/v1/routers/finland/index/graphql';

    // query from https://digitransit.fi/en/developers/apis/1-routing-api/stops/
    // Query scheduled departure and arrival times of a stop
    const query = `
      {
        stop(id: "${stopID}") {
          name
            stoptimesWithoutPatterns {
            scheduledArrival
            realtimeArrival
            arrivalDelay
            scheduledDeparture
            realtimeDeparture
            departureDelay
            realtime
            realtimeState
            serviceDay
            headsign
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
        this.timetable = [];
        if (data.data.stop) {
          const time = data.data.stop.stoptimesWithoutPatterns;

          time.map((t: { serviceDay: number; realtimeArrival: any; realtimeDeparture: any; scheduledArrival: any; scheduledDeparture: any; headsign: any; realtime: any; }) => {

            const dt = DateTime.fromSeconds(t.serviceDay);
            const dtArrival = dt.plus({ seconds: t.realtimeArrival }).toLocaleString(DateTime.TIME_24_SIMPLE);
            const dtDeparture = dt.plus({ seconds: t.realtimeDeparture }).toLocaleString(DateTime.TIME_24_SIMPLE);
            const dtScheduleArr = dt.plus({ seconds: t.scheduledArrival }).toLocaleString(DateTime.TIME_24_SIMPLE);
            const dtScheduleDep = dt.plus({ seconds: t.scheduledDeparture }).toLocaleString(DateTime.TIME_24_SIMPLE);
            const timeDate = new Date(t.serviceDay * 1000).toUTCString();

            // tslint:disable-next-line:max-line-length
            this.timetable = [...this.timetable, { name: data.data.stop.name, headsign: t.headsign, realtimeArrival: t.realtimeArrival, realtimeDeparture: t.realtimeDeparture, scheduledArrival: dtScheduleArr, scheduledDeparture: dtScheduleDep, serviceDay: t.serviceDay, arrival: dtArrival, departure: dtDeparture, date: timeDate, realtime: t.realtime }];
          });
        }

      })
      .catch(error => {
        console.log(error);
      });
  }

}