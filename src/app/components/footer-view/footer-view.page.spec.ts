import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FooterViewPage } from './footer-view.page';

describe('FooterViewPage', () => {
  let component: FooterViewPage;
  let fixture: ComponentFixture<FooterViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
