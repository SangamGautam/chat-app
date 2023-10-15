import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly apiUrl = 'http://localhost:3000/api';  

  constructor(private http: HttpClient) { }

  // Group management
  getAllGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups`);
  }

  createGroup(groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups`, { groupName });
  }

  updateGroup(groupName: string, groupData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}`, groupData);
  }

  deleteGroup(groupName: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}`);
  }

  // Channel management
  getGroupChannels(groupName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels`);
  }

  createChannel(groupName: string, channelName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels`, { channelName });
  }

  editChannel(groupName: string, channelId: string, channelData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels/${channelId}`, channelData);
  }

  deleteChannel(groupName: string, channelId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels/${channelId}`);
  }

  // User management within groups
  removeUser(groupName: string, userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/users/${userId}`);
  }

  banUserFromChannel(groupName: string, channelId: string, userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels/${channelId}/ban`, { userId });
  }

  reportUser(userId: string, reportData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/report`, reportData);
  }

  joinChannel(groupName: string, channelName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels/${channelName}/join`, {});
  }

  leaveGroup(groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/leave`, {});
  }

  // Add approved user to a group to enable chatting
  addUserToGroup(userId: string, groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/addUser`, { userId });
  }

  joinGroup(groupName: string, userId: string): Observable<any> {
    const url = `${this.apiUrl}/groups/${encodeURIComponent(groupName)}/join`;
    return this.http.post(url, { userId });
  }
}
