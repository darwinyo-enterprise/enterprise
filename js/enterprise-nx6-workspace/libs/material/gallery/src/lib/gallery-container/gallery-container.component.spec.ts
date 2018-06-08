import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryContainerComponent } from './gallery-container.component';
import { BaseTestPage } from '@enterprise/core/testing/src';
import { GalleryState } from '../shared/gallery.state';
import { NgxsModule } from '@ngxs/store';
import { GalleryMocks } from '../mocks/gallery.mocks';

export class GalleryContainerPage extends BaseTestPage<GalleryContainerComponent> {
  constructor(public fixture: ComponentFixture<GalleryContainerComponent>) {
    super(fixture);
  }

  get mainImage() {
    return this.query<HTMLInputElement>(".product-detail__container__header__image-container__main-image > img");
  }

  get optImage() {
    return this.queryAll<HTMLElement>(".product-detail__container__header__image-container__opt-image__item > img");
  }
}

describe('GalleryContainerComponent', () => {
  let component: GalleryContainerComponent;
  let fixture: ComponentFixture<GalleryContainerComponent>;
  let page: GalleryContainerPage;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([GalleryState])],
      declarations: [GalleryContainerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GalleryContainerComponent);
    component = fixture.componentInstance;
    page = new GalleryContainerPage(fixture);
    fixture.detectChanges();
  });

  describe('UI Tests', () => {
    it('should display main image', () => {
      component.optImages = GalleryMocks;
      component.ngOnInit();
      fixture.detectChanges();
      expect(page.mainImage.attributes.getNamedItem("src")
        .textContent
      ).toContain(GalleryMocks[0].fileUrl);
    })
    it('should populate file options', () => {
      component.optImages = GalleryMocks;
      component.ngOnInit();
      fixture.detectChanges();
      expect(page.optImage.length).toBe(GalleryMocks.length);
    })
  })
  describe('Functional Test', () => {
    it('should replace main image when optional image clicked', () => {
      expect(page.mainImage.attributes.getNamedItem("src")
        .textContent
      ).not.toContain(GalleryMocks[0].fileUrl);
      component.optImages = GalleryMocks;
      component.ngOnInit();
      fixture.detectChanges();
      expect(page.mainImage.attributes.getNamedItem("src")
        .textContent
      ).toContain(GalleryMocks[0].fileUrl);
      fixture.detectChanges();
      page.optImage[1].click();
      fixture.detectChanges();
      expect(page.mainImage.attributes.getNamedItem("src")
        .textContent
      ).toContain(GalleryMocks[1].fileUrl);
    })
    it('should make active class on img opt when clicked', () => {
      component.optImages = GalleryMocks;
      component.ngOnInit();
      fixture.detectChanges();
      expect(page.optImage[0].classList.contains("active")).toBeTruthy();
      fixture.detectChanges();
      page.optImage[1].click();
      fixture.detectChanges();
      expect(page.optImage[0].classList.contains("active")).toBeFalsy();
      expect(page.optImage[1].classList.contains("active")).toBeTruthy();
    })
  })
});
