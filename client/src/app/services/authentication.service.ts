import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  private apiUrl = 'http://localhost:3000/api/auth'; 

  constructor(private http: HttpClient) {
    const storedUser = sessionStorage.getItem('currentUser');
    const initialUser = storedUser ? JSON.parse(storedUser) : null;
    this.currentUserSubject = new BehaviorSubject<any>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response && response.id) { 
          sessionStorage.setItem('currentUser', JSON.stringify(response)); 
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, password });
  }

  logout() {
    sessionStorage.removeItem('currentUser'); 
    this.currentUserSubject.next(null);
  }

  isSuperAdmin(): boolean {
    const user = this.currentUserValue;
    return user && user['roles'].includes('SuperAdmin');
  }

  isGroupAdmin(): boolean {
    const user = this.currentUserValue;
    return user && user['roles'].includes('GroupAdmin');
  }

  isUser(): boolean {
    const user = this.currentUserValue;
    return user && user['roles'].includes('User');
  }
}
