jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { StudentsService } from '../service/students.service';
import { IStudents, Students } from '../students.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICourses } from 'app/entities/courses/courses.model';
import { CoursesService } from 'app/entities/courses/service/courses.service';

import { StudentsUpdateComponent } from './students-update.component';

describe('Component Tests', () => {
  describe('Students Management Update Component', () => {
    let comp: StudentsUpdateComponent;
    let fixture: ComponentFixture<StudentsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let studentsService: StudentsService;
    let userService: UserService;
    let coursesService: CoursesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [StudentsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(StudentsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StudentsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      studentsService = TestBed.inject(StudentsService);
      userService = TestBed.inject(UserService);
      coursesService = TestBed.inject(CoursesService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const students: IStudents = { id: 456 };
        const user: IUser = { id: 94753 };
        students.user = user;

        const userCollection: IUser[] = [{ id: 95001 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ students });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Courses query and add missing value', () => {
        const students: IStudents = { id: 456 };
        const courses: ICourses[] = [{ id: 8887 }];
        students.courses = courses;

        const coursesCollection: ICourses[] = [{ id: 77903 }];
        jest.spyOn(coursesService, 'query').mockReturnValue(of(new HttpResponse({ body: coursesCollection })));
        const additionalCourses = [...courses];
        const expectedCollection: ICourses[] = [...additionalCourses, ...coursesCollection];
        jest.spyOn(coursesService, 'addCoursesToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ students });
        comp.ngOnInit();

        expect(coursesService.query).toHaveBeenCalled();
        expect(coursesService.addCoursesToCollectionIfMissing).toHaveBeenCalledWith(coursesCollection, ...additionalCourses);
        expect(comp.coursesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const students: IStudents = { id: 456 };
        const user: IUser = { id: 64681 };
        students.user = user;
        const courses: ICourses = { id: 69417 };
        students.courses = [courses];

        activatedRoute.data = of({ students });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(students));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.coursesSharedCollection).toContain(courses);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Students>>();
        const students = { id: 123 };
        jest.spyOn(studentsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ students });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: students }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(studentsService.update).toHaveBeenCalledWith(students);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Students>>();
        const students = new Students();
        jest.spyOn(studentsService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ students });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: students }));
        saveSubject.complete();

        // THEN
        expect(studentsService.create).toHaveBeenCalledWith(students);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Students>>();
        const students = { id: 123 };
        jest.spyOn(studentsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ students });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(studentsService.update).toHaveBeenCalledWith(students);
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
