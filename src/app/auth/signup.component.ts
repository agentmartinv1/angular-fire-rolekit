import { Component } from '@angular/core';
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
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
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
    <div class="signup-wrapper">
      <mat-toolbar color="primary" class="toolbar">
        <span class="toolbar-title">Sign Up</span>
        <span class="spacer"></span>
        <mat-icon>person_add</mat-icon>
      </mat-toolbar>

      <mat-card class="signup-card">
        <h1 class="title">Create Your Account ✨</h1>

        <form (ngSubmit)="onSignup()">
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
              Sign Up
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
    .signup-wrapper {
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

    .signup-card {
      max-width: 500px;
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
      margin-bottom: 20px;
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
      margin-right: 8px;
    }
  `]
})
export class SignupComponent {
  email = '';
  password = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private router: Router
  ) {}

  async onSignup() {
    this.loading = true;

    try {
      const userCred = await this.authService.signup(this.email, this.password);
      const uid = userCred.user.uid;

      await setDoc(doc(this.firestore, 'users', uid), {
        uid,
        email: this.email,
        role: 'viewer'
      });

      console.log('✅ Signed up and Firestore doc created');
      this.router.navigate(['/viewer']);
    } catch (err) {
      console.error('❌ Signup failed:', err);
    } finally {
      // this.loading = false;
    }
  }
}
