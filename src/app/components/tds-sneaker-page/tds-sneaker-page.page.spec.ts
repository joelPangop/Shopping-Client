import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TdsSneakerPagePage } from './tds-sneaker-page.page';

describe('TdsSneakerPagePage', () => {
  let component: TdsSneakerPagePage;
  let fixture: ComponentFixture<TdsSneakerPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdsSneakerPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TdsSneakerPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
