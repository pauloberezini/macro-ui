import { TestBed } from '@angular/core/testing';

import { AlphaVantageService } from './alpha-vantage.service';

describe('AlphaVantageService', () => {
  let service: AlphaVantageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaVantageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
