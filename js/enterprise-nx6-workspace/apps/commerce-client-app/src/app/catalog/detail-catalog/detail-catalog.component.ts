import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImageModel } from '@enterprise/material/gallery';
import { Store, Select } from '@ngxs/store';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FetchProductDetailInfo, ProductState } from '@enterprise/commerce/product-lib/src';
import { ProductDetailViewModel } from '@enterprise/commerce/catalog-lib/src';
import { ReplaySubject, Observable } from 'rxjs';
import { takeUntil, take, takeLast } from 'rxjs/operators';

@Component({
  selector: 'eca-detail-catalog',
  templateUrl: './detail-catalog.component.html',
  styleUrls: ['./detail-catalog.component.scss']
})
export class DetailCatalogComponent implements OnInit, OnDestroy {
  images: ImageModel[];
  productDetail: ProductDetailViewModel;
  quantity = 1;
  @Select(ProductState.getSelectedProductDetailInfo)
  selectedProductDetailInfo: Observable<ProductDetailViewModel>;

  unsubcribe$: ReplaySubject<boolean>;

  constructor(private store: Store, private route: ActivatedRoute) {
    this.unsubcribe$ = new ReplaySubject(1);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.store.dispatch(new FetchProductDetailInfo(params.get('id')))
    });
    this.selectedProductDetailInfo
      .pipe(take(2))
      .subscribe(x => {
        if (x !== null) {
          this.productDetail = x;
        }
      }, err => alert(err),
        () => {
          const imgs = this.productDetail.productImages.map(y => <ImageModel>{
            id: y.id + '',
            fileName: y.imageName,
            fileUrl: y.imageUrl
          });
          this.images = imgs;

          console.log(this.images);
        });
  }
  ngOnDestroy() {
    this.unsubcribe$.next(true);
  }

  onCounterChanged(qty: number) {
    this.quantity = qty;
  }
}
