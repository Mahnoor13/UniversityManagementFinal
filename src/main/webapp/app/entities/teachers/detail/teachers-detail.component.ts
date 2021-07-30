import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITeachers } from '../teachers.model';

@Component({
  selector: 'jhi-teachers-detail',
  templateUrl: './teachers-detail.component.html',
})
export class TeachersDetailComponent implements OnInit {
  teachers: ITeachers | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teachers }) => {
      this.teachers = teachers;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
