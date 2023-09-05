import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';  // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  updateUserRole(userId: string, roleData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}/role`, roleData);
  }

  getUsersByGroup(groupName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups/${groupName}/users`);
  }
}
