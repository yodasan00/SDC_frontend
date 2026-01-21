import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CustomModalComponent } from './shared/components/custom-modal/custom-modal.component';
import { ModalService, ModalConfig } from './core/services/modal.service'; // Import ModalConfig if exported
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    CustomModalComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  modalState$: Observable<ModalConfig>; 
  constructor(private modalService: ModalService) {
    this.modalState$ = this.modalService.modalState$;
  }

  onConfirm(result: any) {
    this.modalService.confirm(result);
  }

  onCancel() {
    this.modalService.close();
  }
}