import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';

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

  createUser(username: string, email: string, role: string, password: string): Observable<any> {
    const userData = {
        username: username,
        email: email,
        role: role,
        password: password
    };
    return this.http.post<any>(`${this.apiUrl}/users`, userData);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`);
  }

  editUser(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, userData);
  }

  reportUser(userId: string, reportData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/report`, reportData);
  }

  banUserFromGroup(groupName: string, userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/groups/${groupName}/users/${userId}/ban`, {});
  }
}
