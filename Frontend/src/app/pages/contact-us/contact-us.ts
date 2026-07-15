import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '../../core/services/email-service/email';
import { ContactMessage } from '../../core/interfaces/contact.interface';
import { PAGES_IMPORTS } from '../pages.imports';
import { AlertService } from '../../core/services/alert-service/alert';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [...PAGES_IMPORTS],
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.scss']
})
export class ContactUsComponent {
  contactForm: FormGroup;
  submitted = false;
  success = false;

  constructor(private fb: FormBuilder,
    private emailService: EmailService,
    private alertService: AlertService
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.valid) {
      const data: ContactMessage = this.contactForm.value;

      this.emailService.sendContactMessage(data).subscribe({
        next: () => {
          this.contactForm.reset();
          this.submitted = false;
          this.success = true;

          // Show success toast
          this.alertService.success('Message Sent', 'Your message has been delivered!');
        },
        error: () => {
          this.submitted = false;
          this.success = false;

          // Show error toast
          this.alertService.error('Failed', 'Unable to send your message. Please try again later.');
        }
      });
    }
  }
}