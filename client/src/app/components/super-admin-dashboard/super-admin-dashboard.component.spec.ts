import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuperAdminDashboardComponent } from './super-admin-dashboard.component';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';  // Adjust the path accordingly
import { FormsModule } from '@angular/forms';

describe('SuperAdminDashboardComponent', () => {
  let component: SuperAdminDashboardComponent;
  let fixture: ComponentFixture<SuperAdminDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [
        SuperAdminDashboardComponent,
        ProfilePictureComponent  // Added ProfilePictureComponent to declarations
      ]
    });
    fixture = TestBed.createComponent(SuperAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
