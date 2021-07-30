import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TeachersComponent } from '../list/teachers.component';
import { TeachersDetailComponent } from '../detail/teachers-detail.component';
import { TeachersUpdateComponent } from '../update/teachers-update.component';
import { TeachersRoutingResolveService } from './teachers-routing-resolve.service';

const teachersRoute: Routes = [
  {
    path: '',
    component: TeachersComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TeachersDetailComponent,
    resolve: {
      teachers: TeachersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TeachersUpdateComponent,
    resolve: {
      teachers: TeachersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TeachersUpdateComponent,
    resolve: {
      teachers: TeachersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(teachersRoute)],
  exports: [RouterModule],
})
export class TeachersRoutingModule {}
