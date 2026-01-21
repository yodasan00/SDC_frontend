import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'confirm';
  showInput?: boolean;
  confirmText?: string;
  callback?: (result?: any) => void; // Function to run when user clicks Confirm/OK
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  // Observable that AppComponent will listen to
  modalState$ = new BehaviorSubject<ModalConfig>({
    isOpen: false, title: '', message: '', type: 'success'
  });

  /**
   * Open the modal
   * @param config Configuration options
   * @param onConfirmCallback Optional function to execute on 'OK'
   */
  open(config: Partial<ModalConfig>, onConfirmCallback?: (result?: any) => void) {
    this.modalState$.next({
      isOpen: true,
      title: config.title || 'Notification',
      message: config.message || '',
      type: config.type || 'success',
      showInput: config.showInput || false,
      confirmText: config.confirmText || 'OK',
      callback: onConfirmCallback
    });
  }

  // Called by the component when user clicks button
  confirm(result?: any) {
    const currentState = this.modalState$.value;
    if (currentState.callback) {
      currentState.callback(result); // Execute the stored function
    }
    this.close();
  }

  close() {
    this.modalState$.next({ ...this.modalState$.value, isOpen: false });
  }
}