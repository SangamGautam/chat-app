import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css']
})
export class SuperAdminDashboardComponent implements OnInit {
  groups: any[] = [];
  users: any[] = [];

  constructor(private groupService: GroupService, private userService: UserService) { }

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
    // For now, we'll just add a mock group for demonstration.
    // In a real-world scenario, you'd open a modal or another component to get the group details.
    const newGroup = { name: 'New Group' };
    this.groups.push(newGroup);
    // TODO: Call the groupService to actually create the group in the backend.
  }

  editGroup(group: any) {
    // For demonstration, we'll just change the group name.
    // In a real-world scenario, you'd open a modal or another component to edit the group details.
    group.name = 'Edited Group';
    // TODO: Call the groupService to actually update the group in the backend.
  }

  deleteGroup(group: any) {
    const index = this.groups.indexOf(group);
    if (index > -1) {
      this.groups.splice(index, 1);
    }
    // TODO: Call the groupService to actually delete the group in the backend.
  }

  updateUserRole(user: any) {
    // For demonstration, we'll just log the updated user.
    // In a real-world scenario, you'd call the userService to update the user's role in the backend.
    console.log('Updated user:', user);
    // TODO: Call the userService to actually update the user role in the backend.
  }
}
