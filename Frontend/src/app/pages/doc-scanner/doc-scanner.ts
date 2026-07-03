import { Component, ElementRef, ViewChild, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocScannerService } from '../../core/services/doc-scan-service/doc-scanner';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-doc-scanner',
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  templateUrl: './doc-scanner.html',
  styleUrls: ['./doc-scanner.scss']
})
export class DocScannerComponent implements OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('captureCanvas') captureCanvas!: ElementRef<HTMLCanvasElement>;

  private docScannerService = inject(DocScannerService);

  // Reactive State using Signals
  public isCameraOn = false;
  public isLoading = signal<boolean>(false);
  public processedImage = signal<string | null>(null);
  public extractedText = signal<string>('');
  public errorMessage = signal<string | null>(null);
  public copySuccess = signal<boolean>(false);
  
  private videoStream: MediaStream | null = null;

  async toggleCamera() {
    if (this.isCameraOn) {
      this.stopCamera();
    } else {
      this.processedImage.set(null);
      this.extractedText.set('');
      await this.startCamera();
    }
  }

  async startCamera() {
    try {
      this.errorMessage.set(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoStream = stream;
      this.videoPlayer.nativeElement.srcObject = stream;
      this.isCameraOn = true;
    } catch (err) {
      this.errorMessage.set('Camera access denied or hardware device not found.');
      console.error('Camera error:', err);
    }
  }

  stopCamera() {
    this.isCameraOn = false;
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.srcObject = null;
    }
  }

  captureAndProcess() {
    const video = this.videoPlayer.nativeElement;
    const canvas = this.captureCanvas.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      this.uploadSnapshot(blob);
    }, 'image/jpeg', 0.95);
  }

  private uploadSnapshot(blob: Blob) {
    this.isLoading.set(true);
    this.stopCamera(); 

    this.docScannerService.processDocument(blob).subscribe({
      next: (res) => {
        this.processedImage.set(`data:image/jpeg;base64,${res.processedImageBase64}`);
        this.extractedText.set(res.extractedText);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Backend OpenCV AI pipeline processing failed.');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.extractedText()).then(() => {
      this.copySuccess.set(true);
      setTimeout(() => this.copySuccess.set(false), 2000);
    });
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}