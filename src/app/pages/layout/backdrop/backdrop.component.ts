import { Component } from '@angular/core';

@Component({
  selector: 'app-backdrop',
  standalone: true,
  imports: [],
  templateUrl: './backdrop.component.html',
  styles:[
  `
    :host {
      display: block;
    }
  `
  ]
})
export class BackdropComponent {}
