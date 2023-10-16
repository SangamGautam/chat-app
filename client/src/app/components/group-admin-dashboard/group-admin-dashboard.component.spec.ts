import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GroupAdminDashboardComponent } from './group-admin-dashboard.component';
import { ProfilePictureComponent } from '../profile-picture/profile-picture.component';  // Adjust the import path accordingly
import { FormsModule } from '@angular/forms';

describe('GroupAdminDashboardComponent', () => {
  let component: GroupAdminDashboardComponent;
  let fixture: ComponentFixture<GroupAdminDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [
        GroupAdminDashboardComponent,
        ProfilePictureComponent  // Include ProfilePictureComponent in declarations
      ]
    });
    fixture = TestBed.createComponent(GroupAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
