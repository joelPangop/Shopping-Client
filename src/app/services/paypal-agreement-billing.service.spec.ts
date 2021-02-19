import { TestBed } from '@angular/core/testing';

import { PaypalAgreementBillingService } from './paypal-agreement-billing.service';

describe('PaypalAgreementBillingService', () => {
  let service: PaypalAgreementBillingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaypalAgreementBillingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
