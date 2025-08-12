import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <div class="min-h-screen flex items-center justify-center bg-blue-100">
      <router-outlet></router-outlet>
    </div>`,
})
export class AppComponent {
  title = 'job-hub';
}
