import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfilePictureService } from './profile-picture.service';

describe('ProfilePictureService', () => {
  let service: ProfilePictureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProfilePictureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
