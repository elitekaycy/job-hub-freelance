import { Component, TemplateRef } from '@angular/core';
import { ToastService } from '../../config/services/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styles: [`
    .toast-container {
      max-height: 100vh;
      overflow-y: auto;
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: any) {
    return toast.template instanceof TemplateRef;
  }

  remove(toast: any) {
    this.toastService.remove(toast);
  }
}
