import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { config } from '../../app.config.base';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitted = false;

  constructor(private http: HttpClient) {}

  onSubmit() {
    console.log('--- CONTACT FORM SUBMIT TRIGGERED ---');
    console.log('Sending data:', JSON.stringify(this.contactData));

    this.submitted = true;
    this.http.post(`${config.apiUrl}/contact`, this.contactData).subscribe({
      next: (res: any) => {
        console.log('--- SERVER RESPONSE RECEIVED ---', res);
        alert(res.message || 'Thank you for contacting us! We will reach out to you soon.');
        this.contactData = { name: '', email: '', subject: '', message: '' };
        this.submitted = false;
      },
      error: (err: any) => {
        console.error('--- SERVER ERROR OCCURRED ---', err);
        const errmsg = err.error?.message || 'Server connection error';
        alert('Failed to send message: ' + errmsg);
        this.submitted = false;
      }
    });
  }
}
