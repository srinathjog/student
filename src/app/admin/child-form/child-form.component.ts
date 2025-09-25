import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-child-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './child-form.component.html',
  styleUrls: ['./child-form.component.scss']
})
export class ChildFormComponent {
  childForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.childForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      class: ['', Validators.required],
      parentName: ['', Validators.required],
      parentContact: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.childForm.valid) {
      // TODO: Handle form submission (e.g., send to backend)
      console.log(this.childForm.value);
    }
  }
}
