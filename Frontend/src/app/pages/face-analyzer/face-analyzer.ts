import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import * as faceapi from '@vladmandic/face-api';
import { FaceDetectionService } from '../../core/services/face-detection/face-detection';
import { PAGES_IMPORTS } from '../pages.imports';

@Component({
  selector: 'app-face-analyzer',
  standalone: true,
  imports: [PAGES_IMPORTS],
  templateUrl: './face-analyzer.html',
  styleUrls: ['./face-analyzer.scss']
})
export class FaceAnalyzerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlayCanvas') overlayCanvas!: ElementRef<HTMLCanvasElement>;

  public stats: any = null;
  public isCameraOn = false;
  private animationId: number | null = null;

  constructor(private faceService: FaceDetectionService) { }

  async ngOnInit() {
    await this.faceService.loadModels();
  }

  async toggleCamera() {
    if (this.isCameraOn) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }
  }

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoPlayer.nativeElement.srcObject = stream;
      this.isCameraOn = true;
      this.videoPlayer.nativeElement.onplay = () => this.runDetection();
    } catch (err) {
      console.error('Camera access denied', err);
    }
  }

  stopCamera() {
    this.isCameraOn = false;
    this.stats = null;
    if (this.animationId) cancelAnimationFrame(this.animationId);

    const stream = this.videoPlayer.nativeElement.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    this.videoPlayer.nativeElement.srcObject = null;

    const canvas = this.overlayCanvas.nativeElement;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  }


  async runDetection() {
    if (!this.isCameraOn) return;

    const video = this.videoPlayer.nativeElement;
    const canvas = this.overlayCanvas.nativeElement;
    const displaySize = { width: 640, height: 480 };
    faceapi.matchDimensions(canvas, displaySize);

    const detect = async () => {
      if (!this.isCameraOn) return;

      const detection = await this.faceService.detectFace(video);
      if (detection) {
        const resized = faceapi.resizeResults(detection, displaySize);
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, displaySize.width, displaySize.height);

        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceExpressions(canvas, resized);

        const emotion = Object.entries(resized.expressions)
          .reduce((a, b) => (a[1] > b[1] ? a : b));

        this.stats = {
          age: resized.age !== undefined ? Math.round(resized.age) : 'N/A',
          gender: resized.gender ?? 'unknown',
          mood: emotion[0]
        };
      }
      // Run again after 300ms instead of every frame
      if (this.isCameraOn) {
        setTimeout(detect, 300);
      }
    };
    detect();
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
