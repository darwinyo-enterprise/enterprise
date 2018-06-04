import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListItemActionsComponent } from "./list-item-actions.component";
import { SharedModule } from "@enterprise/shared";
import { CovalentPagingModule } from "@covalent/core";
import { MatSelectModule } from "@angular/material";
import { NgxsModule } from "@ngxs/store";
import { ListItemActionState } from "./shared/list-item-actions.state";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, SharedModule,
    FormsModule,
    CovalentPagingModule,
    MatSelectModule,
    NgxsModule.forFeature([ListItemActionState])],
  declarations: [ListItemActionsComponent],
  exports: [ListItemActionsComponent]
})
export class ListItemActionsModule {
}
