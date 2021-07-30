jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITeachers, Teachers } from '../teachers.model';
import { TeachersService } from '../service/teachers.service';

import { TeachersRoutingResolveService } from './teachers-routing-resolve.service';

describe('Service Tests', () => {
  describe('Teachers routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TeachersRoutingResolveService;
    let service: TeachersService;
    let resultTeachers: ITeachers | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TeachersRoutingResolveService);
      service = TestBed.inject(TeachersService);
      resultTeachers = undefined;
    });

    describe('resolve', () => {
      it('should return ITeachers returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTeachers = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTeachers).toEqual({ id: 123 });
      });

      it('should return new ITeachers if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTeachers = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTeachers).toEqual(new Teachers());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Teachers })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTeachers = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTeachers).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
