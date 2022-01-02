import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    'email': new FormControl(null, [Validators.email, Validators.required]),
    'password': new FormControl(null, [Validators.minLength(6), Validators.required]),
  });

  loading = false;

  ngOnInit(): void {
  }

  signIn(): void {
    const email = this.loginForm.get("email")?.value;
    const password = this.loginForm.get("password")?.value;
    this.auth.signInWithEmailAndPassword(email, password).subscribe(res => {
      if(res.user) {
        this.router.navigate(["/", res.user?.type]);
      }
    });
  }

}
