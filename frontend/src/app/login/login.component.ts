import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  loginError = false;

  //#region Constructor

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  //#endregion

  //#region Public Functions

  public login() {
    if (this.username === this.adminUser && this.password === this.adminPass) {
      this.loginError = false;

      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('adminUser', this.username);
      }

      this.router.navigate(['/dashboard']);
    } else {
      this.loginError = true;
    }
  }

  //#endregion

  //#region Private Properties

  private readonly adminUser = 'admin';
  private readonly adminPass = 'admin123';

  //#endregion
}
