import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for input binding

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="onOverlayClick($event)">
      <div class="modal-box" [ngClass]="type">
        
        <div class="modal-header">
          <div class="icon-circle">
            <span *ngIf="type === 'success'">✓</span>
            <span *ngIf="type === 'error'">✕</span>
            <span *ngIf="type === 'confirm'">?</span>
          </div>
          <h3>{{ title }}</h3>
        </div>
        
        <div class="modal-body">
          <p>{{ message }}</p>
          
          <textarea *ngIf="showInput" 
                    [(ngModel)]="inputValue" 
                    placeholder="Enter details here..." 
                    class="modal-input"
                    rows="3"></textarea>
        </div>

        <div class="modal-footer">
          <button *ngIf="type === 'confirm'" (click)="onCancel()" class="btn-cancel">
            Cancel
          </button>
          
          <button (click)="onConfirm()" class="btn-confirm">
            {{ confirmText }}
          </button>
        </div>

      </div>
    </div>
  `,
  styleUrls: ['./custom-modal.component.css']
})
export class CustomModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'success' | 'error' | 'confirm' = 'success';
  @Input() showInput = false; 
  @Input() confirmText = 'OK';

  inputValue = ''; // Stores user input if showInput is true

  @Output() confirm = new EventEmitter<string | null>(); // Emits input value (if any)
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    // If input is required but empty, shake or warn (optional validation)
    if (this.showInput && !this.inputValue.trim()) {
      return; 
    }
    this.confirm.emit(this.showInput ? this.inputValue : null);
    this.close();
  }

  onCancel() {
    this.cancel.emit();
    this.close();
  }

  onOverlayClick(event: MouseEvent) {
    // Close if clicking outside the box (optional, depends on preference)
    if ((event.target as HTMLElement).classList.contains('modal-overlay') && this.type !== 'confirm') {
      this.close();
    }
  }

  private close() {
    this.isOpen = false;
    this.inputValue = ''; // Reset input
  }
}