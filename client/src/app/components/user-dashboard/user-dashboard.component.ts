import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { Router } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  @ViewChild(ChatComponent) private chatComponent!: ChatComponent;

  // Initialize user object here
  user: any = { username: '', email: '', id: '', roles: [] };

  users: any[] = [];
  groups: any[] = [];
  currentGroup: string | null = null;

  newUser: { username: string, email: string, role: string, password: string } = { 
    username: '', 
    email: '', 
    role: 'User', 
    password: '' 
  };

  newGroup: { name: string } = { name: '' };

  selectedGroupToJoin?: string;
  selectedGroupToLeave?: string;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private groupService: GroupService,
    private http: HttpClient,
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
    if (this.chatComponent) {
      this.chatComponent.currentGroup = group;
    }
  }

  createUser() {
    this.userService.createUser(this.newUser.username, this.newUser.email, this.newUser.role, this.newUser.password)
    .subscribe(response => {
        this.loadUsers();
        this.newUser = { username: '', email: '', role: 'User', password: '' };
    }, error => {
        console.error('Error creating user:', error);
    });
  }

  joinGroup() {
    if (this.selectedGroupToJoin !== undefined) {
      this.groupService.joinGroup(this.selectedGroupToJoin, this.user._id).subscribe((response: any) => {
        if (response && response.message === 'User is already a member of this group.') {
          this.currentGroup = this.selectedGroupToJoin || null;
        } else {
          // this.message = 'Joined group successfully.';
          this.currentGroup = this.selectedGroupToJoin || null;
        }
        this.loadGroups();
      }, error => {
        console.error('Error joining group:', error);
      });
    } else {
      console.error('selectedGroupToJoin is undefined or null');
    }
}

leaveGroup(groupName: string) {
  this.selectedGroupToLeave = groupName;

  if (this.selectedGroupToLeave) {
    this.groupService.leaveGroup(this.selectedGroupToLeave, this.user._id).subscribe(response => {
      if (this.currentGroup === this.selectedGroupToLeave) {
        this.currentGroup = null;
      }
      this.loadGroups();
    }, error => {
      console.error('Error leaving group:', error);
    });
  } else {
    console.error('selectedGroupToLeave is undefined or null');
  }
}

  deleteSelf() {
    this.userService.deleteUser(this.user._id).subscribe(() => {
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
