export interface ICourses {
  id?: number;
  courseName?: string | null;
  creditHour?: number | null;
}

export class Courses implements ICourses {
  constructor(public id?: number, public courseName?: string | null, public creditHour?: number | null) {}
}

export function getCoursesIdentifier(courses: ICourses): number | undefined {
  return courses.id;
}
