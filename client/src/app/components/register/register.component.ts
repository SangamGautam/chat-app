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
  registerEmail!: string; // Added email property
  registerRole: string = 'User'; // Added role property with a default value of 'User'
  errorMessage!: string;
  registrationMessage?: string;

  constructor(private authService: AuthenticationService, private router: Router) { }

  register() {
    this.authService.register(
      this.registerUsername, 
      this.registerPassword, 
      this.registerEmail, 
      this.registerRole
    ).subscribe(
      response => {
        this.registrationMessage = 'Registration successful! Please login.';
        this.errorMessage = '';
      },
      error => {
        this.errorMessage = 'Registration failed. ' + (error.error.message || 'Username might already exist.');
      }
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
