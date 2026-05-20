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
  public detectedObjects: { class: string; score: number }[] = [];
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
    const ctx = canvas.getContext('2d');

    faceapi.matchDimensions(canvas, displaySize);

    const detect = async () => {
      if (!this.isCameraOn) return;

      const [detection, objects] = await Promise.all([
        this.faceService.detectFace(video),
        this.faceService.detectObjects(video)
      ]);

      // clear
      ctx?.clearRect(0, 0, displaySize.width, displaySize.height);

      // face process
      if (detection) {
        const resized = faceapi.resizeResults(detection, displaySize);
        faceapi.draw.drawDetections(canvas, resized);
        faceapi.draw.drawFaceExpressions(canvas, resized);

        const emotion = Object.entries(resized.expressions)
          .reduce((a, b) => (a[1] > b[1] ? a : b));

        this.stats = {
          age: Math.round(resized.age),
          gender: resized.gender,
          mood: emotion[0]
        };
      }

      // process and draw detection lines
      this.detectedObjects = objects
        .filter(o => o.score > 0.6)
        .map(o => {
          const [x, y, w, h] = o.bbox;
          if (ctx) {
            ctx.strokeStyle = '#00e5ff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);
            ctx.fillStyle = '#00e5ff';
            ctx.fillText(`${o.class} ${Math.round(o.score * 100)}%`, x + 5, y + 15);
          }

          return { class: o.class, score: Math.round(o.score * 100) };
        });

      if (this.isCameraOn) setTimeout(detect, 100);
    };
    detect();
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
