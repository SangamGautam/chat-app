import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { UserDashboardComponent } from './user-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from '../../services/authentication.service';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';  // Import the ProfilePictureComponent

// Create a mock service
class MockAuthenticationService {
  currentUser = { username: 'test-user' };
}

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [UserDashboardComponent, ProfilePictureComponent],
      // Provide the mock service
      providers: [{ provide: AuthenticationService, useClass: MockAuthenticationService }]
    });
    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
