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
  if (typeof window !== 'undefined' && localStorage) {
    return localStorage.getItem('user') !== null;
  }
  return false;
}

  // 🔥 main logic
  isAuthPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/signup';
  }

  logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
  this.router.navigate(['/login']);
}
}