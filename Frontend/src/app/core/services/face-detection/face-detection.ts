import { Injectable } from '@angular/core';
import * as faceapi from '@vladmandic/face-api';

@Injectable({ providedIn: 'root' })
export class FaceDetectionService {
  private modelsLoaded = false;

  async loadModels() {
    if (this.modelsLoaded) return;
    await (faceapi.tf as any).ready();
    const MODEL_URL = '/models';

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
    ]);
    this.modelsLoaded = true;
  }

  detectFace(videoElement: HTMLVideoElement) {
    return faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions({ inputSize: 160 }))
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();
  }

}
