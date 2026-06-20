import { Injectable, signal } from '@angular/core';

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  isOpen = signal<boolean>(false);
  title = signal<string>('Confirmation');
  message = signal<string>('Are you sure?');
  confirmText = signal<string>('Confirm');
  cancelText = signal<string>('Cancel');
  private resolveCallback?: () => void;

  ask(config: ConfirmConfig) {
    this.title.set(config.title);
    this.message.set(config.message);
    this.confirmText.set(config.confirmText || 'Confirm');
    this.cancelText.set(config.cancelText || 'Cancel');
    this.resolveCallback = config.onConfirm;
    this.isOpen.set(true);
  }

  confirm() {
    this.isOpen.set(false);
    if (this.resolveCallback) {
      this.resolveCallback();
    }
  }

  cancel() {
    this.isOpen.set(false);
  }
}
