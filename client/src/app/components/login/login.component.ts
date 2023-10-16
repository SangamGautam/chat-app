import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username!: string;
  password!: string;
  errorMessage!: string;

  constructor(private authService: AuthenticationService, private router: Router) { }

  login() {
    // Clear the error message
    this.errorMessage = '';

    // Basic validation
    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required.';
      return;
    }

// Basic validation
if (!this.username || !this.password) {
  this.errorMessage = 'Username and password are required.';
  return;
}

this.authService.login(this.username, this.password).subscribe(
  user => {
    if (user && user._id) { // Check if the response has an 'id' property, indicating a successful login
      // Check user roles and navigate accordingly
      if (user.roles.includes('SuperAdmin')) {
        this.router.navigate(['/super-admin-dashboard']);
      } else if (user.roles.includes('GroupAdmin')) {
        this.router.navigate(['/group-admin-dashboard']);
      } else {
        this.router.navigate(['/user-dashboard']);
      }
    } else {
      this.errorMessage = user.message || 'Invalid username or password';
    }
  },
  error => {
    this.errorMessage = error.error.message || 'An error occurred. Please try again later.';
  }
);
}
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
