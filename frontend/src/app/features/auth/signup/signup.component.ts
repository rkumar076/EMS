import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignup() {
    const data = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.signup(data).subscribe({
      next: (res) => {
        console.log('Response:', res);
        alert('Signup Successful');

        // 👉 signup ke baad login page pe bhej
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Signup Failed');
      }
    });
  }
}