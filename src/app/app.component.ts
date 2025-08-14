import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="relative min-h-screen overflow-hidden">
      <div class="absolute inset-0 -z-20 bg-[url('/assets/office_url2.jpg')] bg-cover bg-center"></div>
      <div class="absolute inset-0 -z-10 bg-black/25"></div>
      <router-outlet></router-outlet>
    </div>
    `,
})
export class AppComponent {
  title = 'job-hub';
}
