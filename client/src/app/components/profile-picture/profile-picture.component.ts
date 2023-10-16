import { Component } from '@angular/core';
import { ProfilePictureService } from '../../services/profile-picture.service';
import { AuthenticationService } from '../../services/authentication.service';  // Import the AuthenticationService

@Component({
  selector: 'app-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.css']
})
export class ProfilePictureComponent {
  selectedFile: File | null = null;
  profilePictureUrl: string | null = null;

  constructor(
    private profilePictureService: ProfilePictureService,
    private authenticationService: AuthenticationService  // Inject the AuthenticationService
  ) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(): void {
    if (this.selectedFile) {
      const userId = this.authenticationService.currentUserValue?._id;  // Get the user's ID from the AuthenticationService
      if (userId) {
        this.profilePictureService.uploadProfilePicture(this.selectedFile, userId)  // Pass the user's ID to the uploadProfilePicture method
          .subscribe(
            response => {
              
              this.profilePictureUrl = response.imageUrl;
              console.log('Image uploaded successfully:', response);
            },
            error => {
              console.error('Error uploading image:', error);
            }
          );
      } else {
        console.error('No user is logged in.');
      }
    }
  }
}
