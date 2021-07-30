import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TeachersDetailComponent } from './teachers-detail.component';

describe('Component Tests', () => {
  describe('Teachers Management Detail Component', () => {
    let comp: TeachersDetailComponent;
    let fixture: ComponentFixture<TeachersDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TeachersDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ teachers: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TeachersDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TeachersDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load teachers on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.teachers).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
