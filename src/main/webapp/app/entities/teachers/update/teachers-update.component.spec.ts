jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TeachersService } from '../service/teachers.service';
import { ITeachers, Teachers } from '../teachers.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICourses } from 'app/entities/courses/courses.model';
import { CoursesService } from 'app/entities/courses/service/courses.service';

import { TeachersUpdateComponent } from './teachers-update.component';

describe('Component Tests', () => {
  describe('Teachers Management Update Component', () => {
    let comp: TeachersUpdateComponent;
    let fixture: ComponentFixture<TeachersUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let teachersService: TeachersService;
    let userService: UserService;
    let coursesService: CoursesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TeachersUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TeachersUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TeachersUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      teachersService = TestBed.inject(TeachersService);
      userService = TestBed.inject(UserService);
      coursesService = TestBed.inject(CoursesService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const teachers: ITeachers = { id: 456 };
        const user: IUser = { id: 27390 };
        teachers.user = user;

        const userCollection: IUser[] = [{ id: 37054 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ teachers });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Courses query and add missing value', () => {
        const teachers: ITeachers = { id: 456 };
        const courses: ICourses[] = [{ id: 13951 }];
        teachers.courses = courses;

        const coursesCollection: ICourses[] = [{ id: 86080 }];
        jest.spyOn(coursesService, 'query').mockReturnValue(of(new HttpResponse({ body: coursesCollection })));
        const additionalCourses = [...courses];
        const expectedCollection: ICourses[] = [...additionalCourses, ...coursesCollection];
        jest.spyOn(coursesService, 'addCoursesToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ teachers });
        comp.ngOnInit();

        expect(coursesService.query).toHaveBeenCalled();
        expect(coursesService.addCoursesToCollectionIfMissing).toHaveBeenCalledWith(coursesCollection, ...additionalCourses);
        expect(comp.coursesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const teachers: ITeachers = { id: 456 };
        const user: IUser = { id: 9409 };
        teachers.user = user;
        const courses: ICourses = { id: 2314 };
        teachers.courses = [courses];

        activatedRoute.data = of({ teachers });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(teachers));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.coursesSharedCollection).toContain(courses);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Teachers>>();
        const teachers = { id: 123 };
        jest.spyOn(teachersService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ teachers });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: teachers }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(teachersService.update).toHaveBeenCalledWith(teachers);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Teachers>>();
        const teachers = new Teachers();
        jest.spyOn(teachersService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ teachers });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: teachers }));
        saveSubject.complete();

        // THEN
        expect(teachersService.create).toHaveBeenCalledWith(teachers);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Teachers>>();
        const teachers = { id: 123 };
        jest.spyOn(teachersService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ teachers });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(teachersService.update).toHaveBeenCalledWith(teachers);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCoursesById', () => {
        it('Should return tracked Courses primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCoursesById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedCourses', () => {
        it('Should return option if no Courses is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedCourses(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Courses for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedCourses(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Courses is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedCourses(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
