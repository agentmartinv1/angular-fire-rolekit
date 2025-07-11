import {
  Component,
  inject,
  runInInjectionContext,
  EnvironmentInjector
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { doc, getDoc, Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-wrapper">
      <mat-toolbar color="primary" class="toolbar">
        <span class="toolbar-title">Login</span>
        <span class="spacer"></span>
        <mat-icon>lock</mat-icon>
      </mat-toolbar>

      <mat-card class="login-card">
        <h1 class="title">Welcome Back 👋</h1>
        <form (ngSubmit)="onLogin()">
          <mat-form-field appearance="outline" class="field">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" name="email" required />
          </mat-form-field>

          <mat-form-field appearance="outline" class="field">
            <mat-label>Password</mat-label>
            <input matInput type="password" [(ngModel)]="password" name="password" required />
          </mat-form-field>

          <button mat-stroked-button color="primary" class="action-btn" type="submit" [disabled]="loading">
            <ng-container *ngIf="!loading; else spinner">
              Login
            </ng-container>
            <ng-template #spinner>
              <mat-spinner diameter="24"></mat-spinner>
            </ng-template>
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f5f5f5;
    }

    .toolbar {
      background: #e3f2fd;
      color: #0d47a1;
      padding: 0 24px;
    }

    .toolbar-title {
      font-weight: 600;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .login-card {
      max-width: 480px;
      margin: 48px auto;
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      background: white;
    }

    .title {
      font-size: 28px;
      margin-bottom: 24px;
      font-weight: 600;
      color: #333;
      text-align: center;
    }

    .field {
      width: 100%;
      margin-bottom: 10px;
    }

    .action-btn {
      width: 100%;
      padding: 25px;
      font-weight: 500;
      font-size: 16px;
      text-transform: none;
      border-radius: 8px;
      transition: background-color 0.3s ease, border-color 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .action-btn:hover {
      background-color: rgba(25, 118, 210, 0.08);
      border-color: #1976d2;
    }

    mat-icon {
      margin-left: 12px;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private injector = inject(EnvironmentInjector);

  onLogin() {
    this.loading = true;

    this.authService.login(this.email, this.password)
      .then(res => {
        runInInjectionContext(this.injector, async () => {
          const firestore = inject(Firestore);
          const uid = res.user.uid;
          const userDoc = await getDoc(doc(firestore, 'users', uid));

          if (!userDoc.exists()) {
            console.error('❌ User document does not exist');
            this.router.navigate(['/unauthorized']);
            this.loading = false;
            return;
          }

          const role = userDoc.data()?.['role'];
          switch (role) {
            case 'admin': this.router.navigate(['/admin']); break;
            case 'editor': this.router.navigate(['/editor']); break;
            case 'viewer': this.router.navigate(['/viewer']); break;
            default: this.router.navigate(['/unauthorized']);
          }

          // this.loading = false;
        });
      })
      .catch(err => {
        console.error('❌ Login failed:', err);
        this.loading = false;
      });
  }
}
