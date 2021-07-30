import { IUser } from 'app/entities/user/user.model';
import { ICourses } from 'app/entities/courses/courses.model';

export interface IStudents {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  user?: IUser | null;
  courses?: ICourses[] | null;
}

export class Students implements IStudents {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public phone?: string | null,
    public user?: IUser | null,
    public courses?: ICourses[] | null
  ) {}
}

export function getStudentsIdentifier(students: IStudents): number | undefined {
  return students.id;
}
