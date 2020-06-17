import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeTopSliderPage } from './home-top-slider.page';

describe('HomeTopSliderPage', () => {
  let component: HomeTopSliderPage;
  let fixture: ComponentFixture<HomeTopSliderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeTopSliderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTopSliderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
