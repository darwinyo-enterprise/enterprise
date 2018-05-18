import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListItemActionsComponent } from "@enterprise/material/list-item-actions/src/list-item-actions.component";
import { SharedModule } from "@enterprise/shared";

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [ListItemActionsComponent],
  exports: [ListItemActionsComponent]
})
export class ListItemActionsModule {
}
