import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PreviewSearchPage } from './preview-search.page';

describe('PreviewSearchPage', () => {
  let component: PreviewSearchPage;
  let fixture: ComponentFixture<PreviewSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
