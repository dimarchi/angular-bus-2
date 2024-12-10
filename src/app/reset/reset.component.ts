import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { DataService } from '../data-service.service';

@Component({
    selector: 'app-reset',
    templateUrl: './reset.component.html',
    styleUrls: ['./reset.component.css'],
    standalone: false
})
export class ResetComponent implements OnInit {

  constructor(private resetter: DataService) { }

  @Output() resetView: EventEmitter<any> = new EventEmitter<any>();

  resetViewToDefault() {
    this.resetter.resetter = 1;
    this.resetView.emit('reset');
  }

  updateLocation() {
    this.resetter.resetter = 0;
    this.resetView.emit('update');
  }

  ngOnInit(): void {
  }

}