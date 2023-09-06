import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service'; // Import AuthenticationService
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-group-admin-dashboard',
  templateUrl: './group-admin-dashboard.component.html',
  styleUrls: ['./group-admin-dashboard.component.css']
})
export class GroupAdminDashboardComponent implements OnInit {
  groupName: string = 'Sample Group'; // Replace with actual group name from backend
  groupUsers: any[] = []; // Users within the group

  constructor(
    private groupService: GroupService, 
    private userService: UserService,
    private authService: AuthenticationService, // Inject AuthenticationService
    private router: Router // Inject Router
  ) { }

  ngOnInit(): void {
    this.loadGroupUsers();
  }

  loadGroupUsers() {
    // Fetch users within the group from the backend
    this.userService.getUsersByGroup(this.groupName).subscribe(
      (data: any[]) => {
        this.groupUsers = data;
      },
      error => {
        console.error('Error fetching group users:', error);
        // Optionally display an error message to the user
      }
    );
}


  editUser(user: any) {
    // Logic to edit user details
  }

  removeUserFromGroup(user: any) {
    // Logic to remove user from the group
  }

  // Add the logout method
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']); // Navigate to login page after logout
    });
  }
}
