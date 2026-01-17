import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; // Ensure RouterLink is imported
import { TicketService } from '../../../core/services/ticket.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Added RouterLink to imports
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent {
  ticketForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router
  ) {
    // REMOVED 'priority' from here
    this.ticketForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit() {
    if (this.ticketForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = this.ticketForm.value;

    this.ticketService.createTicket(formData).subscribe({
      next: (res) => {
        console.log('Ticket Created:', res);
        this.isSubmitting = false;
        this.successMessage = 'Ticket created successfully! Redirecting...';
        
        // Reset form (No priority to reset)
        this.ticketForm.reset();

        // Redirect back to "My Tickets"
        setTimeout(() => {
          this.router.navigate(['/department/my-tickets']);
        }, 1500);
      },
      error: (err) => {
        console.error('Create Error:', err);
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create ticket. Please try again.';
      }
    });
  }
}