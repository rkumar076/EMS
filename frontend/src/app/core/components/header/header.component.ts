import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');   // ✅ token check
  }

  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }

  logout() {
    localStorage.removeItem('token');   // ✅ token remove
    localStorage.removeItem('user');    // optional
    this.router.navigate(['/login']);
  }
}