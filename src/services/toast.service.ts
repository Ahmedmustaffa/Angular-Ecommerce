import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'danger' | 'info' | 'warning';
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: 'success' | 'danger' | 'info' | 'warning' = 'info') {
    const id = this.nextId++;
    this.toasts.update(current => [...current, { message, type, id }]);
    
    // Automatically dismiss after 3 seconds
    setTimeout(() => {
      this.dismiss(id);
    }, 3000);
  }

  dismiss(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
