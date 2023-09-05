import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerUsername!: string;
  registerPassword!: string;
  errorMessage!: string;
  registrationMessage?: string;

  constructor(private authService: AuthenticationService, private router: Router) { }

  register() {
    const isRegistered = this.authService.register(this.registerUsername, this.registerPassword);
    if (isRegistered) {
      this.registrationMessage = 'Registration successful! Please login.';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Registration failed. Username might already exist.';
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
