import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  snackBar = inject(MatSnackBar);

  constructor() {
    this.snackBar.open(
      '⚠️ Firebase is not configured. Please update environment.ts',
      'Dismiss',
      { duration: 5000, panelClass: 'warn-snackbar' }
    );
  }
  protected readonly title = signal('angular-fire-rolekit');
}
