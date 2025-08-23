import { Injectable, TemplateRef } from '@angular/core';
import { Toast } from '../../interfaces/general.interface';


@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: Toast[] = [];

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    const toast = { text: textOrTpl as string, template: textOrTpl as TemplateRef<any>, ...options };
    this.toasts.push(toast);
    
    // Auto remove if delay is provided
    if (options.delay) {
      setTimeout(() => this.remove(toast), options.delay);
    }
    
    return toast;
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }

  success(message: string, delay: number = 5000) {
    this.show(message, { classname: 'bg-green-500 text-white', delay });
  }

  error(message: string, delay: number = 5000) {
    this.show(message, { classname: 'bg-red-500 text-white', delay });
  }

  info(message: string, delay: number = 5000) {
    this.show(message, { classname: 'bg-blue-500 text-white', delay });
  }

  warning(message: string, delay: number = 5000) {
    this.show(message, { classname: 'bg-yellow-500 text-white', delay });
  }
}