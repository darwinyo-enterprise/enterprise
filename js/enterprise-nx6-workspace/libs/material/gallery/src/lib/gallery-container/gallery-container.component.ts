import { Component, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GalleryState } from '../shared/gallery.state';
import { ImageModel } from '../models/image.model';
import { SelectImage, SetImages } from '../shared/gallery.actions';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'em-gallery-container',
  templateUrl: './gallery-container.component.html',
  styleUrls: ['./gallery-container.component.scss']
})
export class GalleryContainerComponent implements OnInit {
  @Input()
  optImages: ImageModel[];

  @Select(GalleryState.getImages)
  images: Observable<ImageModel[]>;

  @Select(GalleryState.getSelectedImage)
  selectedImage: Observable<ImageModel>;

  constructor(private store: Store) { }

  ngOnInit() {
    if (this.optImages !== undefined || this.optImages === null) {
      this.store.dispatch(new SetImages(this.optImages));
    }
  }

  onOptionImageClicked(id: string) {
    this.store.dispatch(new SelectImage(id));
  }
}
