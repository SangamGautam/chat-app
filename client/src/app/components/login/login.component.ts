import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username!: string;
  password!: string;
  errorMessage!: string;

  constructor(private authService: AuthenticationService) { }

  login() {
    const isAuthenticated = this.authService.login(this.username, this.password);
    if (!isAuthenticated) {
      this.errorMessage = 'Invalid username or password';
    } else {
      // Navigate to dashboard or any other page after successful login
      // You can use Angular's Router for this
    }
  }
}
