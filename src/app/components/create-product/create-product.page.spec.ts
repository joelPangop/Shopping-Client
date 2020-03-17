import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateProductPage } from './create-product.page';

describe('CreateProductPage', () => {
  let component: CreateProductPage;
  let fixture: ComponentFixture<CreateProductPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProductPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
