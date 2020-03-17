import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreviewImagePage } from './preview-image.page';

describe('PreviewImagePage', () => {
  let component: PreviewImagePage;
  let fixture: ComponentFixture<PreviewImagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewImagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
