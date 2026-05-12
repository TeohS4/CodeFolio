import { Component, Input } from '@angular/core';
import { AiSummaryComponent } from '../ai-summary/ai-summary';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ai-fab',
  imports: [CommonModule, AiSummaryComponent],
  templateUrl: './ai-fab.html',
  styleUrls: ['./ai-fab.scss']
})
export class AiFabComponent {

  @Input() project: any;

  open = false;

  toggle() {
    this.open = !this.open;
  }
}