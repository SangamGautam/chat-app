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
      this.groups.push({ ...this.newGroup });
      this.newGroup.name = ''; // Reset the form
    }
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
    // Here, you can add logic to update the user's role in the backend.
    // For now, I'm just logging the updated user.
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
