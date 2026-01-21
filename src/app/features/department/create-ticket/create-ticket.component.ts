import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent {
  ticketForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  selectedFile: File | null = null; // Store the file here

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router
  ) {
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // 1. Capture the file when user selects it
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.ticketForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // 2. Prepare FormData (Required for file uploads)
    const formData = new FormData();
    formData.append('title', this.ticketForm.get('title')?.value);
    formData.append('description', this.ticketForm.get('description')?.value);
    
    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile);
    }

    // 3. Send to Service
    this.ticketService.createTicket(formData).subscribe({
      next: () => {
        this.successMessage = 'Ticket created successfully!';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/department/my-tickets']), 1500);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to create ticket. Please try again.';
        this.isSubmitting = false;
      }
    });
  }
}