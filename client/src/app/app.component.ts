import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';

  // User role flags
  isAdmin: boolean = false;
  isGroupAdmin: boolean = false;
  isUser: boolean = false;

  constructor() {
    // For demonstration purposes, I'm using a dummy value for the user's role.
    // In a real-world scenario, you'd fetch this from a service, API, or local storage.
    const userRole = 'User'; 

    this.setUserRole(userRole);
  }

  setUserRole(role: string) {
    switch (role) {
      case 'Super Admin':
        this.isAdmin = true;
        break;
      case 'Group Admin':
        this.isGroupAdmin = true;
        break;
      case 'User':
        this.isUser = true;
        break;
      default:
        console.error('Invalid user role provided');
    }
  }
}
