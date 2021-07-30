import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'courses',
        data: { pageTitle: 'Courses' },
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
      },
      {
        path: 'students',
        data: { pageTitle: 'Students' },
        loadChildren: () => import('./students/students.module').then(m => m.StudentsModule),
      },
      {
        path: 'teachers',
        data: { pageTitle: 'Teachers' },
        loadChildren: () => import('./teachers/teachers.module').then(m => m.TeachersModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
