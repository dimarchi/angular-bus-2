import { Component, OnInit } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.css'],
    standalone: false
})
export class HelpComponent implements OnInit {

  constructor() { }

  faQuestionCircle = faQuestionCircle;

  visibilityCheck = 0;

  toggle(): void {
    this.visibilityCheck === 0 ? this.visibilityCheck = 1 : this.visibilityCheck = 0;
  }

  ngOnInit(): void {
  }

}