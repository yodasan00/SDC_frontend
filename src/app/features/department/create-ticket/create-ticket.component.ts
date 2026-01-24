import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// Ensure this path matches where your TicketService is located
import { TicketService, TicketType, RequestType, PriorityOption } from '../../../core/services/ticket.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {
  // Form Data Model
  ticket = {
    title: '',
    description: '',
    priority: '',        
    ticket_type: '',     
    request_type: '',   
    affected_end_user: ''
  };
  
  selectedFile: File | null = null;
  
  // Dropdown Data Sources
  ticketTypes: TicketType[] = [];
  requestTypes: RequestType[] = [];
  priorities: PriorityOption[] = [];
  
  isSubmitting = false;

  constructor(
    private ticketService: TicketService,
    private router: Router,
    private modalService: ModalService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadMetadata();
  }

  loadMetadata() {
    // 1. Load Categories
    this.ticketService.getTicketTypes().subscribe({
      next: (data) => this.ticketTypes = data,
      error: (err) => console.error('Failed to load types', err)
    });

    // 2. Load Priorities
    this.ticketService.getPriorities().subscribe({
      next: (data) => this.priorities = data,
      error: (err) => console.error('Failed to load priorities', err)
    });
  }

  // Triggered when User selects a Category (Ticket Type)
  onTypeChange() {
    // Reset the sub-category selection
    this.ticket.request_type = ''; 
    this.requestTypes = []; 

    if (this.ticket.ticket_type) {
      const typeId = Number(this.ticket.ticket_type);
      
      // Fetch dependent Request Types (Cascading Logic)
      this.ticketService.getRequestTypes(typeId).subscribe(data => {
        this.requestTypes = data;
        this.cd.detectChanges(); // Force UI update
      });
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    // Basic Validation
    if (!this.ticket.title || !this.ticket.ticket_type || !this.ticket.priority) {
      this.modalService.open({ 
        title: 'Missing Information', 
        message: 'Please fill in the Title, Priority, and Category fields.', 
        type: 'error' 
      });
      return;
    }

    this.isSubmitting = true;

    // Build FormData (Required for File Uploads + Data)
    const formData = new FormData();
    formData.append('title', this.ticket.title);
    formData.append('description', this.ticket.description);
    formData.append('priority', this.ticket.priority);
    formData.append('ticket_type', this.ticket.ticket_type); // Sends ID
    
    if (this.ticket.request_type) {
      formData.append('request_type', this.ticket.request_type); // Sends ID
    }
    
    if (this.ticket.affected_end_user) {
      formData.append('affected_end_user', this.ticket.affected_end_user);
    }
    
    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile);
    }

    // Call API
    this.ticketService.createTicket(formData).subscribe({
      next: () => {
        this.modalService.open({
          title: 'Success', 
          message: 'Your ticket has been submitted successfully!', 
          type: 'success'
        }, () => {
          this.router.navigate(['/department/home']);
        });
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        this.modalService.open({ 
          title: 'Error', 
          message: 'Failed to create ticket. Please try again.', 
          type: 'error' 
        });
      }
    });
  }
}