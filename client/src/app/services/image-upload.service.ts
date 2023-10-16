import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  
  private uploadUrl = 'http://localhost:3000/api/upload';  // Adjusted to your endpoint

  constructor(private http: HttpClient) { }

  uploadImage(formData: FormData): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',  // Adjust headers accordingly to your server's needs
      })
    };

    return this.http.post(this.uploadUrl, formData, httpOptions);
  }
}
