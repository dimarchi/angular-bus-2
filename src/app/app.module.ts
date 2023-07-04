import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BusStopComponent } from './bus-stop/bus-stop.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from './footer/footer.component';
import { HelpComponent } from './help/help.component';
import { ResetComponent } from './reset/reset.component';
import { RoutesComponent } from './routes/routes.component';
import { TimetableComponent } from './timetable/timetable.component';

import { DataService } from './data-service.service';

@NgModule({
  declarations: [
    AppComponent,
    BusStopComponent,
    FooterComponent,
    HelpComponent,
    ResetComponent,
    RoutesComponent,
    TimetableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
