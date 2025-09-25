import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  students: any[] = [];
  showAddModal = false;
  addStudentForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute) {
    this.addStudentForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      class: ['', Validators.required],
      dob: ['', Validators.required],
      rollNumber: ['', Validators.required],
      classTeacher: ['', Validators.required],
      dateOfAdmission: ['', Validators.required],
      userId: ['', Validators.required],
      category: ['', Validators.required],
      schoolMailId: ['', [Validators.required, Validators.email]],
      adhaarNumber: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      profileImage: ['']
    });
  }

  ngOnInit() {
    this.students = this.route.snapshot.data['students'] || [];
  }

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
    this.addStudentForm.reset();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.addStudentForm.patchValue({ profileImage: file });
    }
  }

  submitAddStudent() {
    if (this.addStudentForm.valid) {
      // TODO: Send data to API
      console.log(this.addStudentForm.value);
      this.closeAddModal();
    }
  }
}
