import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITeachers, Teachers } from '../teachers.model';
import { TeachersService } from '../service/teachers.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICourses } from 'app/entities/courses/courses.model';
import { CoursesService } from 'app/entities/courses/service/courses.service';

@Component({
  selector: 'jhi-teachers-update',
  templateUrl: './teachers-update.component.html',
})
export class TeachersUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  coursesSharedCollection: ICourses[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
    phone: [],
    user: [],
    courses: [],
  });

  constructor(
    protected teachersService: TeachersService,
    protected userService: UserService,
    protected coursesService: CoursesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teachers }) => {
      this.updateForm(teachers);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const teachers = this.createFromForm();
    if (teachers.id !== undefined) {
      this.subscribeToSaveResponse(this.teachersService.update(teachers));
    } else {
      this.subscribeToSaveResponse(this.teachersService.create(teachers));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackCoursesById(index: number, item: ICourses): number {
    return item.id!;
  }

  getSelectedCourses(option: ICourses, selectedVals?: ICourses[]): ICourses {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITeachers>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(teachers: ITeachers): void {
    this.editForm.patchValue({
      id: teachers.id,
      firstName: teachers.firstName,
      lastName: teachers.lastName,
      phone: teachers.phone,
      user: teachers.user,
      courses: teachers.courses,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, teachers.user);
    this.coursesSharedCollection = this.coursesService.addCoursesToCollectionIfMissing(
      this.coursesSharedCollection,
      ...(teachers.courses ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.coursesService
      .query()
      .pipe(map((res: HttpResponse<ICourses[]>) => res.body ?? []))
      .pipe(
        map((courses: ICourses[]) =>
          this.coursesService.addCoursesToCollectionIfMissing(courses, ...(this.editForm.get('courses')!.value ?? []))
        )
      )
      .subscribe((courses: ICourses[]) => (this.coursesSharedCollection = courses));
  }

  protected createFromForm(): ITeachers {
    return {
      ...new Teachers(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      user: this.editForm.get(['user'])!.value,
      courses: this.editForm.get(['courses'])!.value,
    };
  }
}
