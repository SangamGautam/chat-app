import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'; // Import AuthenticationService
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  user: any = {
    username: 'JohnDoe',
    email: 'john.doe@example.com',
    id: '12345',
    roles: ['User'],
    groups: ['Group1', 'Group2']
  };
  currentGroup: string | null = null;
  message: string = '';

  constructor(
    private authService: AuthenticationService, // Inject AuthenticationService
    private router: Router // Inject Router
  ) { }

  ngOnInit(): void {
  }

  openChat(group: string) {
    this.currentGroup = group;
    // Load chat messages for the selected group
  }

  sendMessage() {
    // Logic to send the message to the current group
  }

  // Add the logout method
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']); // Navigate to login page after logout
    });
  }
}
