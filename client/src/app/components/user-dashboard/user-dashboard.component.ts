import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { Router } from '@angular/router';

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
  users: any[] = [];
  groups: any[] = [];
  currentGroup: string | null = null;
  message: string = '';
  newUser: { username: string, email: string, role: string, password: string } = { 
    username: '', 
    email: '', 
    role: 'User', 
    password: '' 
};

  newGroup: { name: string } = { name: '' };  // Added this property

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private groupService: GroupService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadGroups();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    }, error => {
      console.error('Error fetching users:', error);
    });
  }

  loadGroups() {
    this.groupService.getAllGroups().subscribe(data => {
      this.groups = data;
    }, error => {
      console.error('Error fetching groups:', error);
    });
  }

  openChat(group: string) {
    this.currentGroup = group;
    // Load chat messages for the selected group
  }

  sendMessage() {
    // Logic to send the message to the current group
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

  // Added these methods
  createGroup() {
    // Logic to create a new group
  }

  editGroup(group: any) {
    // Logic to edit the group
  }

  deleteGroup(group: any) {
    // Logic to delete the group
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
