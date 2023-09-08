import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  groups: any[] = [];
  users: any[] = [];
  userRequests: any[] = [];
  newUser: { username: string, email: string, role: string, password: string } = { 
    username: '', 
    email: '', 
    role: 'User', 
    password: '' 
  };

  newGroup: { name: string } = { name: '' };

  constructor(
    private groupService: GroupService, 
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
    this.loadUserRequests();
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
    if (this.newGroup.name.trim()) {
      this.groupService.createGroup(this.newGroup.name).subscribe(() => {
        this.loadGroups();
        this.newGroup.name = ''; // Reset the form
      }, error => {
        console.error('Error creating group:', error);
      });
    }
  }

  editGroup(group: any) {
    const newName = prompt('Enter the new name for the group:', group.name);
    if (newName && newName !== group.name) {
      this.groupService.updateGroup(group.name, { name: newName }).subscribe(() => {
        this.loadGroups();
      }, error => {
        console.error('Error editing group:', error);
      });
    }
  }

  deleteGroup(group: any) {
    this.groupService.deleteGroup(group.name).subscribe(() => {
      this.loadGroups();
    }, error => {
      console.error('Error deleting group:', error);
    });
  }

  createChannel(groupName: string, channelName: string) {
    this.groupService.createChannel(groupName, channelName).subscribe(() => {
      this.loadGroups();
    }, error => {
      console.error('Error creating channel:', error);
    });
  }

  loadUserRequests() {
    this.userService.getUserRequests().subscribe(data => {
        this.userRequests = data;
    }, error => {
        console.error('Error fetching user requests:', error);
    });
  }

  approveUserRequest(request: any) {
    this.groupService.approveUserRequest(request.userId, request.groupName).subscribe(() => {
        const index = this.userRequests.indexOf(request);
        if (index > -1) {
            this.userRequests.splice(index, 1);
        }
    }, error => {
        console.error('Error approving user request:', error);
    });
  }

  denyUserRequest(request: any) {
    const index = this.userRequests.indexOf(request);
    if (index > -1) {
        this.userRequests.splice(index, 1);
    }
  }

  createUser() {
    this.userService.createUser(this.newUser.username, this.newUser.email, this.newUser.role, this.newUser.password)
    .subscribe(response => {
        this.loadUsers();
        this.newUser = { username: '', email: '', role: 'User', password: '' }; // Reset the form
    }, error => {
        console.error('Error creating user:', error);
    });
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId.toString()).subscribe(() => {
      this.loadUsers();
    }, error => {
      console.error('Error deleting user:', error);
    });
  }

  updateUserRole(user: any) {
    console.log('Updated user:', user);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    }, error => {
      console.error('Error during logout:', error);
    });
  }
}
