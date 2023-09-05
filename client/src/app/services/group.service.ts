import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:3000/api';  // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  getAllGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups`);
  }

  createGroup(groupData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups`, groupData);
  }

  updateGroup(groupId: string, groupData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/groups/${groupId}`, groupData);
  }

  deleteGroup(groupId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/groups/${groupId}`);
  }
}
