import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:3000/api';  

  constructor(private http: HttpClient) { }

  getAllGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups`);
  }

  createGroup(groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups`, { groupName: groupName });
  }

  updateGroup(groupName: string, groupData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/groups/${groupName}`, groupData);
  }

  deleteGroup(groupName: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/groups/${groupName}`);
  }

  // Channel management
  createChannel(groupName: string, channelName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/${groupName}/channels`, { channelName: channelName });
  }

  editChannel(groupName: string, channelId: string, channelData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/groups/${groupName}/channels/${channelId}`, channelData);
  }

  deleteChannel(groupName: string, channelId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/groups/${groupName}/channels/${channelId}`);
  }

  // User management within groups
  removeUser(groupName: string, userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/groups/${groupName}/users/${userId}`);
  }

  banUserFromChannel(groupName: string, channelId: string, userId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/groups/${groupName}/channels/${channelId}/ban`, { userId: userId });
  }

  reportUser(userId: string, reportData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/report`, reportData);
  }

  // Methods based on your requirements
  requestToJoinGroup(groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/requestToJoin`, {});
}

  joinChannel(groupName: string, channelName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/${groupName}/channels/${channelName}/join`, {});
  }

  leaveGroup(groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/${groupName}/leave`, {});
  }

  // Approve user request to join a group
  approveUserRequest(userId: string, groupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/${groupName}/approveUser`, { userId: userId });
  }
}
