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
  user: any = {};
  users: any[] = [];
  groups: any[] = [];
  currentGroup: string | null = null;
  currentGroupChannels: string[] = [];
  message: string = '';
  newUser: { username: string, email: string, role: string, password: string } = { 
    username: '', 
    email: '', 
    role: 'User', 
    password: '' 
  };

  newGroup: { name: string } = { name: '' };

  selectedGroupToJoin?: string;
  selectedGroupToLeave?: string;
  selectedChannelToJoin?: string;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private groupService: GroupService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
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
    // For demonstration purposes, I'm using dummy data. You should replace this with an actual API call.
    this.currentGroupChannels = ['Channel1', 'Channel2', 'Channel3'];  // Replace with actual channels for the selected group
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

  // Register interest in a group
requestToJoinGroup() {
  if (!this.selectedGroupToJoin) {
    console.error('No group selected to join.');
    return;
  }

  this.groupService.requestToJoinGroup(this.selectedGroupToJoin).subscribe(response => {
    this.message = 'Request sent to join group.';
  }, error => {
    console.error('Error requesting to join group:', error);
  });
}


// Join a channel within a group
joinChannel() {
  if (this.currentGroup && this.selectedChannelToJoin) {
    this.groupService.joinChannel(this.currentGroup, this.selectedChannelToJoin).subscribe(response => {
      this.message = 'Joined channel successfully.';
    }, error => {
      console.error('Error joining channel:', error);
    });
  } else {
    console.error('currentGroup or selectedChannelToJoin is undefined or null');
  }
}

// Leave a group
leaveGroup() {
  if (this.selectedGroupToLeave) {
    this.groupService.leaveGroup(this.selectedGroupToLeave).subscribe(response => {
      this.message = 'Left group successfully.';
      this.loadGroups(); // Refresh the list of groups
    }, error => {
      console.error('Error leaving group:', error);
    });
  } else {
    console.error('selectedGroupToLeave is undefined or null');
  }
}


  // Delete the user
  deleteSelf() {
    this.userService.deleteUser(this.user.id).subscribe(() => {
      this.authService.logout().subscribe(() => {
        this.router.navigate(['/login']);
      });
    }, error => {
      console.error('Error deleting user:', error);
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
