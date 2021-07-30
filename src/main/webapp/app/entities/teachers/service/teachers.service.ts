import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITeachers, getTeachersIdentifier } from '../teachers.model';

export type EntityResponseType = HttpResponse<ITeachers>;
export type EntityArrayResponseType = HttpResponse<ITeachers[]>;

@Injectable({ providedIn: 'root' })
export class TeachersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/teachers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(teachers: ITeachers): Observable<EntityResponseType> {
    return this.http.post<ITeachers>(this.resourceUrl, teachers, { observe: 'response' });
  }

  update(teachers: ITeachers): Observable<EntityResponseType> {
    return this.http.put<ITeachers>(`${this.resourceUrl}/${getTeachersIdentifier(teachers) as number}`, teachers, { observe: 'response' });
  }

  partialUpdate(teachers: ITeachers): Observable<EntityResponseType> {
    return this.http.patch<ITeachers>(`${this.resourceUrl}/${getTeachersIdentifier(teachers) as number}`, teachers, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITeachers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITeachers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTeachersToCollectionIfMissing(teachersCollection: ITeachers[], ...teachersToCheck: (ITeachers | null | undefined)[]): ITeachers[] {
    const teachers: ITeachers[] = teachersToCheck.filter(isPresent);
    if (teachers.length > 0) {
      const teachersCollectionIdentifiers = teachersCollection.map(teachersItem => getTeachersIdentifier(teachersItem)!);
      const teachersToAdd = teachers.filter(teachersItem => {
        const teachersIdentifier = getTeachersIdentifier(teachersItem);
        if (teachersIdentifier == null || teachersCollectionIdentifiers.includes(teachersIdentifier)) {
          return false;
        }
        teachersCollectionIdentifiers.push(teachersIdentifier);
        return true;
      });
      return [...teachersToAdd, ...teachersCollection];
    }
    return teachersCollection;
  }
}
