import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  currentUser: any = null; // Store the current logged-in user's details

  constructor() { }

  // Updated login method
  login(username: string, password: string): boolean {
    // For demonstration purposes, we'll mock a simple authentication
    // In a real-world scenario, you'd make an API call here
    if (username === 'admin' && password === 'password') {
      this.currentUser = {
        username: username,
        roles: ['SuperAdmin']
      };
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
  }

  isSuperAdmin(): boolean {
    return this.currentUser && this.currentUser.roles.includes('SuperAdmin');
  }

  isGroupAdmin(): boolean {
    return this.currentUser && this.currentUser.roles.includes('GroupAdmin');
  }

  isUser(): boolean {
    return this.currentUser && this.currentUser.roles.includes('User');
  }
}
