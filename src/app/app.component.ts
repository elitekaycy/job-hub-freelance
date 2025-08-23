import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from "./components/toast/toast.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  template: `
    <div class="relative min-h-screen overflow-hidden">
      <div class="absolute inset-0 -z-20 bg-[url('/assets/office_url2.jpg')] bg-cover bg-center"></div>
      <div class="absolute inset-0 -z-10 bg-black/25"></div>
      <router-outlet></router-outlet>
        <!-- toast container -->
        <app-toast/>
    </div>
    `,
})
export class AppComponent {
  title = 'job-hub';
}
