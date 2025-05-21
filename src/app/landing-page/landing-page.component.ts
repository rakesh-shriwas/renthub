import { Component, inject, OnInit, signal } from '@angular/core';
import { NavComponent } from '../main/nav/nav.component';
import { RouterOutlet } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs/internal/Subject';


@Component({
  selector: 'app-landing-page',
  imports: [
    NavComponent,
    RouterOutlet,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
