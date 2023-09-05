import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service'; // Import AuthenticationService
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  groups: any[] = [];
  users: any[] = [];

  constructor(
    private groupService: GroupService, 
    private userService: UserService,
    private authService: AuthenticationService, // Inject AuthenticationService
    private router: Router // Inject Router
  ) { }

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
  }

  loadGroups() {
    this.groupService.getAllGroups().subscribe(data => {
      this.groups = data;
    }, error => {
      console.error('Error fetching groups:', error);
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  createGroup() {
    const newGroup = { name: 'New Group' };
    this.groups.push(newGroup);
  }

  editGroup(group: any) {
    group.name = 'Edited Group';
  }

  deleteGroup(group: any) {
    const index = this.groups.indexOf(group);
    if (index > -1) {
      this.groups.splice(index, 1);
    }
  }

  updateUserRole(user: any) {
    console.log('Updated user:', user);
  }

  // Add the logout method
  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']); // Navigate to login page after logout
    }, error => {
      console.error('Error during logout:', error);
    });
  }
}
