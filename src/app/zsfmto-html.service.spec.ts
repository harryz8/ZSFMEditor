import { TestBed } from '@angular/core/testing';

import { ZSFMToHTMLService } from './zsfmto-html.service';

describe('ZSFMToHTMLService', () => {
  let service: ZSFMToHTMLService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZSFMToHTMLService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
