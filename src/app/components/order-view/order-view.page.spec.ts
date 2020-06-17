import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderViewPage } from './order-view.page';

describe('OrderViewPage', () => {
  let component: OrderViewPage;
  let fixture: ComponentFixture<OrderViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
