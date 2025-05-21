import { AsyncPipe, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from '@angular/router';
import { LoginSignupDialogComponent } from '../login-signup-dialog/login-signup-dialog.component';
import { CreatePostDialogComponent } from '../create-post-dialog/create-post-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../services/common.service';
import { UserRole } from '../../enums/app.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../../models/user.vm';
import { Store } from '@ngrx/store';
import { selectFavoriteCount } from '../../store/renthub.selectors';

@Component({
  selector: 'app-nav',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    AsyncPipe,
    NgIf,
    RouterLinkActive,
    TitleCasePipe,
    MatBadgeModule
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent implements OnInit {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private store = inject(Store);
  private service = inject(CommonService);
  loggedInUserDetails$ = new BehaviorSubject<IUser | null>(null);
  userRoles = UserRole;

  favoriteCount$: Observable<number> = this.store.select(selectFavoriteCount);

  ngOnInit(): void {
    this.service.getAuthenticateUser().subscribe((res) => {
      if (res) {
        this.loggedInUserDetails$.next(res);
      }
    });
  }

  /**
   * Login Signup Dialog
   *
   * @param {string} dialogType
   * @memberof NavComponent
   */
  openLoginSignupDialog(dialogType: string): void {
    const dialogRef = this.dialog.open(LoginSignupDialogComponent, {
      data: dialogType,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loggedInUserDetails$.next(result);
      this.router.navigate(['/app']);
    });
  }

  /**
   * Open Create Post Dialog
   *
   * @memberof NavComponent
   */
  createNewPost() {
    this.dialog.open(CreatePostDialogComponent, {
      maxWidth: '950px',
      autoFocus: false,
      restoreFocus: false
    });
  }

  /**
   * Logout
   *
   * @memberof NavComponent
   */
  logOut() {
    console.log('------logout-------');
    localStorage.removeItem('loggedInUser');
    this.loggedInUserDetails$.next(null);
    this.router.navigate(['/']);
  }
}
