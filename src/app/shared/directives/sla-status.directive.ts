import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { TicketService } from '../../core/services/ticket.service';

@Directive({
  selector: '[appSlaStatus]',
  standalone: true
})
export class SlaStatusDirective implements OnInit {
  @Input('appSlaStatus') ticket: any;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    // 1. Safety Checks
    if (!this.ticket || !this.ticket.created_at || !this.ticket.priority) return;
    
    // 2. Stop checking if ticket is already finished
    if (['COMPLETED', 'CLOSED', 'REJECTED'].includes(this.ticket.status)) return;

    // 3. Calculate Deadline
    const slaHours = this.ticketService.getSlaHours(this.ticket.priority);
    const createdTime = new Date(this.ticket.created_at).getTime();
    const deadlineTime = createdTime + (slaHours * 60 * 60 * 1000); // hours to milliseconds
    const currentTime = new Date().getTime();

    // 4. Apply Styles if Overdue
    if (currentTime > deadlineTime) {
      // Red Border
      this.renderer.setStyle(this.el.nativeElement, 'border', '2px solid #e74c3c');
      this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
      
      // "Overdue" Badge
      const badge = this.renderer.createElement('div');
      this.renderer.setProperty(badge, 'innerText', 'SLA BREACHED');
      
      // Badge Styling
      this.renderer.setStyle(badge, 'position', 'absolute');
      this.renderer.setStyle(badge, 'top', '-12px');
      this.renderer.setStyle(badge, 'right', '20px');
      this.renderer.setStyle(badge, 'background', '#c0392b');
      this.renderer.setStyle(badge, 'color', 'white');
      this.renderer.setStyle(badge, 'padding', '4px 8px');
      this.renderer.setStyle(badge, 'font-size', '0.75rem');
      this.renderer.setStyle(badge, 'border-radius', '4px');
      this.renderer.setStyle(badge, 'font-weight', 'bold');
      this.renderer.setStyle(badge, 'box-shadow', '0 2px 4px rgba(0,0,0,0.2)');

      this.renderer.appendChild(this.el.nativeElement, badge);
    }
  }
}