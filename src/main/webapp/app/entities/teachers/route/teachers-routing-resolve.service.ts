import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITeachers, Teachers } from '../teachers.model';
import { TeachersService } from '../service/teachers.service';

@Injectable({ providedIn: 'root' })
export class TeachersRoutingResolveService implements Resolve<ITeachers> {
  constructor(protected service: TeachersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITeachers> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((teachers: HttpResponse<Teachers>) => {
          if (teachers.body) {
            return of(teachers.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Teachers());
  }
}
