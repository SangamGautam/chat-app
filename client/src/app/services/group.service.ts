import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Group {
  name: string;
  channels?: any[];
  users?: any[];
}

interface Channel {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // ============ Group management ============

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/groups`);
  }

  createGroup(groupName: string): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/groups`, { groupName });
  }

  updateGroup(groupName: string, groupData: Partial<Group>): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}`, groupData);
  }

  deleteGroup(groupName: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}`);
  }

  // ============ Channel management ============

  getGroupChannels(groupName: string): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels`);
  }

  createChannel(groupName: string, channelName: string): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels`, { channelName });
  }

  editChannel(groupName: string, channelId: string, channelData: Partial<Channel>): Observable<Channel> {
    return this.http.put<Channel>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels/${channelId}`, channelData);
  }

  deleteChannel(groupName: string, channelId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels/${channelId}`);
  }

  // ============ User management within groups ============

  removeUser(groupName: string, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/users/${userId}`);
  }

  banUserFromChannel(groupName: string, channelId: string, userId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels/${channelId}/ban`, { userId });
  }

  reportUser(userId: string, reportData: any): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/users/${userId}/report`, reportData);
  }

  joinChannel(groupName: string, channelName: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/channels/${channelName}/join`, {});
  }

  leaveGroup(groupName: string, userId: string): Observable<void> {
    const url = `${this.apiUrl}/groups/${encodeURIComponent(groupName)}/leave`;
    return this.http.post<void>(url, { userId });
  }


  addUserToGroup(userId: string, groupName: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/groups/${encodeURIComponent(groupName)}/addUser`, { userId });
  }

  joinGroup(groupName: string, userId: string): Observable<void> {
    const url = `${this.apiUrl}/groups/${encodeURIComponent(groupName)}/join`;
    return this.http.post<void>(url, { userId });
  }
}
