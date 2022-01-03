import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../lib/models/course/Course';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private auth: AuthService, private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    const url = `${environment.apiUrl}/courses`;
    return this.http.get<Course[]>(url, this.auth.getPrivateHeaders());
  }
}
