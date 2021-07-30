import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeachers } from '../teachers.model';
import { TeachersService } from '../service/teachers.service';

@Component({
  templateUrl: './teachers-delete-dialog.component.html',
})
export class TeachersDeleteDialogComponent {
  teachers?: ITeachers;

  constructor(protected teachersService: TeachersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.teachersService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
