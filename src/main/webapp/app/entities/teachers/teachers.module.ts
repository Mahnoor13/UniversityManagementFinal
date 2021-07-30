import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TeachersComponent } from './list/teachers.component';
import { TeachersDetailComponent } from './detail/teachers-detail.component';
import { TeachersUpdateComponent } from './update/teachers-update.component';
import { TeachersDeleteDialogComponent } from './delete/teachers-delete-dialog.component';
import { TeachersRoutingModule } from './route/teachers-routing.module';

@NgModule({
  imports: [SharedModule, TeachersRoutingModule],
  declarations: [TeachersComponent, TeachersDetailComponent, TeachersUpdateComponent, TeachersDeleteDialogComponent],
  entryComponents: [TeachersDeleteDialogComponent],
})
export class TeachersModule {}
