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

    this.authService.login(this.username, this.password).subscribe(
      response => {
        if (response && response.id) { // Check if the response has an 'id' property, indicating a successful login
          // Check user roles and navigate accordingly
          if (this.authService.isSuperAdmin()) {
            this.router.navigate(['/super-admin-dashboard']);
          } else if (this.authService.isGroupAdmin()) {
            this.router.navigate(['/group-admin-dashboard']);
          } else if (this.authService.isUser()) {
            this.router.navigate(['/user-dashboard']);
          }
        } else {
          this.errorMessage = response.message || 'Invalid username or password';
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
