import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureService {
  private apiUrl = 'http://localhost:3000/api/uploadProfilePicture';

  constructor(private http: HttpClient) { }

  uploadProfilePicture(file: File, userId: string): Observable<any> {  // <-- Added userId parameter
    const formData = new FormData();
    formData.append('profilePicture', file, file.name);
    formData.append('userId', userId);  // <-- Use dynamic userId
    return this.http.post(this.apiUrl, formData);
  }
}

