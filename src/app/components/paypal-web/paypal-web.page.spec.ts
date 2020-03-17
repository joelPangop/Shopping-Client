import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaypalWebPage } from './paypal-web.page';

describe('PaypalWebPage', () => {
  let component: PaypalWebPage;
  let fixture: ComponentFixture<PaypalWebPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalWebPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaypalWebPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
