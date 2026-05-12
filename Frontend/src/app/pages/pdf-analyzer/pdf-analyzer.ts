import { Component, signal } from '@angular/core';
import { PdfService } from '../../core/services/pdf/pdf';
import { PAGES_IMPORTS } from '../pages.imports';
import { AlertService } from '../../core/services/alert-service/alert';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-pdf-analyzer',
  standalone: true,
  imports: [PAGES_IMPORTS, MatProgressBarModule, MarkdownModule],
  templateUrl: './pdf-analyzer.html',
  styleUrls: ['./pdf-analyzer.scss']
})
export class PdfAnalyzerComponent {
  analysis = signal<string>('');
  isLoading = signal<boolean>(false);
  userQuestion = signal<string>('');
  lastAnswer = signal<string>('');
  isAsking = signal<boolean>(false);
  extractedText = signal<string>('');
  fileName = signal<string>('');
  suggestions = signal<string[]>([]);

  constructor(
    private pdfService: PdfService,
    private alertService: AlertService
  ) { }

  private typeEffect(fullText: string, targetSignal: any) {
    targetSignal.set('');
    let i = 0;
    const chunkSize = 2;

    const interval = setInterval(() => {
      const nextChunk = fullText.slice(i, i + chunkSize);
      targetSignal.update((current: string) => current + nextChunk);
      i += chunkSize;

      if (i >= fullText.length) clearInterval(interval);
    }, 1);
  }

  generateSuggestions(summary: string) {
    this.pdfService.ask(summary, "Provide 3 very short(max 7 words each)follow-up questions separated by a pipe symbol |").subscribe((res: any) => {
      const raw = res?.choices?.[0]?.message?.content || '';
      console.log('Raw Suggestions:', raw);

      const parts = raw.split('|')
        .map((q: string) => q.trim().replace(/^\d+\.\s*/, ''))
        .filter((q: string) => q.length > 0);

      this.suggestions.set(parts.slice(0, 3));
    });
  }

  useSuggestion(q: string) {
    this.userQuestion.set(q);
    this.askQuestion();
    this.suggestions.set([]); // Hide after use
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName.set(file.name);
      this.analysis.set('');
      this.extractedText.set('');
      this.isLoading.set(true);

      this.pdfService.uploadAndAnalyze(file).subscribe({
        next: (res: any) => {
          if (res?.choices?.[0]) {
            const content = res.choices[0].message.content;
            this.extractedText.set(res.extractedText);
            this.typeEffect(content, this.analysis);
            this.generateSuggestions(content);
          }
          this.isLoading.set(false);
          this.alertService.success('Analysis Complete');
        },
        error: (err) => {
          this.isLoading.set(false);
          this.alertService.error('Upload Failed', 'Llama could not process this PDF.');
        }
      });
    }
  }

  askQuestion() {
    const text = this.extractedText();
    const question = this.userQuestion();
    if (!question || !text) return;

    this.isAsking.set(true);
    this.userQuestion.set('');

    this.pdfService.ask(text, question).subscribe({
      next: (res: any) => {
        const content = res?.choices?.[0]?.message?.content;
        if (content) {
          this.typeEffect(content, this.lastAnswer);
        }
        this.isAsking.set(false);
        this.alertService.success('Llama Answered');
      },
      error: () => {
        this.isAsking.set(false);
        this.alertService.error('Error', 'Llama failed to answer.');
      }
    });
  }

}
