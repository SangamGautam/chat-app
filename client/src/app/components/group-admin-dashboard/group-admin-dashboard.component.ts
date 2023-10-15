import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-group-admin-dashboard',
  templateUrl: './group-admin-dashboard.component.html',
  styleUrls: ['./group-admin-dashboard.component.css']
})
export class GroupAdminDashboardComponent implements OnInit {
  @ViewChild(ChatComponent) private chatComponent!: ChatComponent;

  selectedGroup: any = null; // To store the currently selected group
  groupUsers: any[] = [];
  newGroupName: string = '';
  newChannelName: string = '';
  allGroups: any[] = [];
  allChannels: any[] = [];
  currentChannel: string = '';

  constructor(
    private groupService: GroupService,
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllGroups();
  }

  selectGroup(group: any) {
    this.selectedGroup = group;
    this.loadChannelsForGroup();
    this.loadGroupUsers();

    // Open the chat for the selected group
    if (this.chatComponent) {
      this.chatComponent.currentGroup = this.selectedGroup.name;
      this.chatComponent.joinChannel(this.selectedGroup.name);
      this.chatComponent.messages = []; // Clear previous messages from the chat component
    }
  }

  loadChannelsForGroup() {
    this.groupService.getGroupChannels(this.selectedGroup.name).subscribe((data: any[]) => {
        this.allChannels = data;
    }, (error: any) => {
        console.error('Error fetching channels:', error);
    });
 }
 

  selectChannel(channelName: string) {
    this.currentChannel = channelName;
  }

  // Group-related methods
  loadAllGroups() {
    this.groupService.getAllGroups().subscribe((data: any[]) => {
       this.allGroups = data;
    }, (error: any) => {
       console.error('Error fetching groups:', error);
    });
 } 

  createGroup() {
    if (!this.newGroupName) return;
    this.groupService.createGroup(this.newGroupName).subscribe(
      () => {
        console.log('Group created successfully');
        this.loadAllGroups();
      },
      error => console.error('Error creating group:', error)
    );
  }

  editGroupPrompt(group: any) {
    const newName = prompt('Enter the new name for the group:', group.name);
    if (newName && newName !== group.name) {
      const groupData = { name: newName };
      this.groupService.updateGroup(group.name, groupData).subscribe(
        () => {
          console.log('Group edited successfully');
          this.loadAllGroups();
        },
        error => console.error('Error editing group:', error)
      );
    }
  }

  deleteGroupPrompt(group: any) {
    if (confirm(`Are you sure you want to delete the group: ${group.name}?`)) {
      this.groupService.deleteGroup(group.name).subscribe(
        () => {
          console.log('Group deleted successfully');
          this.loadAllGroups();
        },
        error => console.error('Error deleting group:', error)
      );
    }
  }

  // Channel-related methods
  createChannel() {
    if (!this.newChannelName || !this.selectedGroup) return;
    this.groupService.createChannel(this.selectedGroup.name, this.newChannelName).subscribe(
      () => {
        console.log('Channel created successfully');
        this.loadAllGroups();
      },
      error => console.error('Error creating channel:', error)
    );
  }

  // User-related methods
  loadGroupUsers() {
    if (!this.selectedGroup) return;
    this.userService.getUsersByGroup(this.selectedGroup.name).subscribe(
      data => this.groupUsers = data,
      error => console.error('Error fetching group users:', error)
    );
  }

  editUser(user: any) {
    const userData = { username: user.username, email: user.email };
    this.userService.editUser(user.id, userData).subscribe(
      () => {
        console.log('User edited successfully');
        this.loadGroupUsers();
      },
      error => console.error('Error editing user:', error)
    );
  }

  addUserToGroup(userId: number) {
    this.groupService.addUserToGroup(this.selectedGroup.name, userId.toString()).subscribe(() => {
        this.loadGroupUsers();
    }, error => {
        console.error('Error adding user to group:', error);
    });
 } 

  removeUserFromGroup(user: any) {
    this.groupService.removeUser(this.selectedGroup.name, user.id).subscribe(
      () => {
        console.log('User removed from group successfully');
        this.loadGroupUsers();
      },
      error => console.error('Error removing user from group:', error)
    );
  }

  banUserFromChannel(user: any) {
    this.groupService.banUserFromChannel(this.selectedGroup.name, this.newChannelName, user.id).subscribe(
      () => console.log('User banned from channel successfully'),
      error => console.error('Error banning user from channel:', error)
    );
  }

  reportToSuperAdmin(user: any) {
    const reportData = { reason: 'Inappropriate behavior' };
    this.userService.reportUser(user.id, reportData).subscribe(
      () => console.log('User reported to super admin successfully'),
      error => console.error('Error reporting user to super admin:', error)
    );
  }

  // Authentication
  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
