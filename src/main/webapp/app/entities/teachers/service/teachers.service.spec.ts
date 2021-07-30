import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITeachers, Teachers } from '../teachers.model';

import { TeachersService } from './teachers.service';

describe('Service Tests', () => {
  describe('Teachers Service', () => {
    let service: TeachersService;
    let httpMock: HttpTestingController;
    let elemDefault: ITeachers;
    let expectedResult: ITeachers | ITeachers[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TeachersService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        firstName: 'AAAAAAA',
        lastName: 'AAAAAAA',
        phone: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Teachers', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Teachers()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Teachers', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            phone: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Teachers', () => {
        const patchObject = Object.assign(
          {
            firstName: 'BBBBBB',
          },
          new Teachers()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Teachers', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            phone: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Teachers', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTeachersToCollectionIfMissing', () => {
        it('should add a Teachers to an empty array', () => {
          const teachers: ITeachers = { id: 123 };
          expectedResult = service.addTeachersToCollectionIfMissing([], teachers);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(teachers);
        });

        it('should not add a Teachers to an array that contains it', () => {
          const teachers: ITeachers = { id: 123 };
          const teachersCollection: ITeachers[] = [
            {
              ...teachers,
            },
            { id: 456 },
          ];
          expectedResult = service.addTeachersToCollectionIfMissing(teachersCollection, teachers);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Teachers to an array that doesn't contain it", () => {
          const teachers: ITeachers = { id: 123 };
          const teachersCollection: ITeachers[] = [{ id: 456 }];
          expectedResult = service.addTeachersToCollectionIfMissing(teachersCollection, teachers);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(teachers);
        });

        it('should add only unique Teachers to an array', () => {
          const teachersArray: ITeachers[] = [{ id: 123 }, { id: 456 }, { id: 92937 }];
          const teachersCollection: ITeachers[] = [{ id: 123 }];
          expectedResult = service.addTeachersToCollectionIfMissing(teachersCollection, ...teachersArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const teachers: ITeachers = { id: 123 };
          const teachers2: ITeachers = { id: 456 };
          expectedResult = service.addTeachersToCollectionIfMissing([], teachers, teachers2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(teachers);
          expect(expectedResult).toContain(teachers2);
        });

        it('should accept null and undefined values', () => {
          const teachers: ITeachers = { id: 123 };
          expectedResult = service.addTeachersToCollectionIfMissing([], null, teachers, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(teachers);
        });

        it('should return initial array if no Teachers is added', () => {
          const teachersCollection: ITeachers[] = [{ id: 123 }];
          expectedResult = service.addTeachersToCollectionIfMissing(teachersCollection, undefined, null);
          expect(expectedResult).toEqual(teachersCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
