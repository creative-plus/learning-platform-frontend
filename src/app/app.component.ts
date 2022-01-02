import { Component, OnInit } from '@angular/core';
import { AuthUser } from './lib/models/auth/AuthUser';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'learning-platform-frontend';
  loading = true;
  user: AuthUser | undefined = undefined;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getAuthUser().subscribe(user => {
      this.user = user;
    });
  }
  
}
