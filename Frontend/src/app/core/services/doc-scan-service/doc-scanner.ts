import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ScanResponse {
  processedImageBase64: string;
  extractedText: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocScannerService {
  private http = inject(HttpClient);
  // Match this with your ASP.NET Core application URL
  private apiUrl = 'https://localhost:7026/api/docscanner/process';

  processDocument(imageBlob: Blob): Observable<ScanResponse> {
    const formData = new FormData();
    formData.append('file', imageBlob, 'webcam-snapshot.jpg');
    
    return this.http.post<ScanResponse>(this.apiUrl, formData);
  }
}
