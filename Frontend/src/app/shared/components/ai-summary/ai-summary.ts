import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../../core/services/ai-service/ai';
import { PAGES_IMPORTS } from '../../../pages/pages.imports';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-ai-summary',
  standalone: true,
  imports: [PAGES_IMPORTS, MarkdownModule],
  templateUrl: './ai-summary.html',
})
export class AiSummaryComponent {

  @Input() project: any;

  private aiService = inject(AiService);

  loading = false;

  summary = '';

  generateSummary() {

    this.loading = true;

    this.aiService.generateSummary(this.project)
      .subscribe({
        next: (res) => {
          this.summary = res.summary;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}