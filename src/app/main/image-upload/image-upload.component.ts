import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-image-upload',
  imports: [MatCardModule, NgIf],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss'
})
export class ImageUploadComponent {
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files).filter(file =>
      /\.(jpg|jpeg)$/i.test(file.name)
    );

    this.selectedFiles = files;
    this.previewUrls = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.previewUrls.push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  uploadImages() {
    const formData = new FormData();
    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    this.http.post('http://localhost:3000/upload', formData).subscribe({
      next: () => alert('Upload successful!'),
      error: () => alert('Upload failed!'),
    });
  }
}
