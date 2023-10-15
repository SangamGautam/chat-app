import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';  // Import the ChatComponent

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  @ViewChild(ChatComponent) private chatComponent!: ChatComponent;  // Get access to the ChatComponent

  groups: any[] = [];
  users: any[] = [];
  groupUsers: any[] = []; // Users within the selected group
  userRequests: any[] = [];
  selectedGroup: string | null = null;  // Store the currently selected group
  newChannel: { name: string } = { name: '' }; // New channel name within a group
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
    console.log(this.chatComponent);
    this.loadGroups();
    this.loadUsers();
  }

  selectGroup(group: any) {
    console.log("Group selected:", group.name);
    this.selectedGroup = group.name;

    if (this.selectedGroup && this.chatComponent) {
        console.log("Joining chat channel...");
        this.chatComponent.currentGroup = this.selectedGroup;
        this.chatComponent.joinChannel(this.selectedGroup);
        this.chatComponent.messages = [];
    }

    this.loadGroupUsers(); // Load users specific to this group
}



loadGroups() {
  this.groupService.getAllGroups().subscribe(data => {
    console.log("Loaded groups:", data); // Log this
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

  // Load users belonging to a specific group
  loadGroupUsers() {
    if (this.selectedGroup) {
      // TODO: Fetch users from the backend service for the selected group
      // Example:
      // this.groupService.getUsersForGroup(this.selectedGroup).subscribe(data => {
      //   this.groupUsers = data;
      // }, error => {
      //   console.error('Error fetching group users:', error);
      // });
    }
  }

  // Function to remove a user from a group
  removeUserFromGroup(userId: number) {
    if (this.selectedGroup) {
      // TODO: Logic to remove a user from the group using a service
      // Example:
      // this.groupService.removeUserFromGroup(this.selectedGroup, userId).subscribe(response => {
      //   // Handle success, maybe reload group users
      //   this.loadGroupUsers();
      // }, error => {
      //   // Handle error
      // });
    }
  }

  createGroup() {
    if (this.newGroup.name.trim()) {
      this.groupService.createGroup(this.newGroup.name).subscribe(() => {
        this.loadGroups();
        this.newGroup.name = '';
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

  createUser() {
    this.userService.createUser(this.newUser.username, this.newUser.email, this.newUser.role, this.newUser.password)
    .subscribe(() => {
      this.loadUsers();
      this.newUser = { username: '', email: '', role: 'User', password: '' };
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

  manageGroupUsers(group: any) {
    // Logic to manage users of the selected group
    // For now, I'm just logging the selected group. 
    // You should add the actual logic based on your requirements.
    console.log("Managing users for group:", group);
 }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    }, error => {
      console.error('Error during logout:', error);
    });
  }
}
