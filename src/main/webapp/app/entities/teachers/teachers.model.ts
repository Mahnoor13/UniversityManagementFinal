import { IUser } from 'app/entities/user/user.model';
import { ICourses } from 'app/entities/courses/courses.model';

export interface ITeachers {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  user?: IUser | null;
  courses?: ICourses[] | null;
}

export class Teachers implements ITeachers {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public phone?: string | null,
    public user?: IUser | null,
    public courses?: ICourses[] | null
  ) {}
}

export function getTeachersIdentifier(teachers: ITeachers): number | undefined {
  return teachers.id;
}
