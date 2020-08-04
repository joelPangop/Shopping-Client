import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreviewVideoPage } from './preview-video.page';

describe('PreviewVideoPage', () => {
  let component: PreviewVideoPage;
  let fixture: ComponentFixture<PreviewVideoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewVideoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewVideoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
