import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IPostResponse } from '../../models/post.vm';
import { UserRole } from '../../enums/app.enum';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-post-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule, TitleCasePipe, CurrencyPipe],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.scss',
})
export class PostCardComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() post: IPostResponse;
  @Input() loggedInUserDetails: any;
  @Input() isFavorite: boolean = false;
  @Output() viewPostDetails = new EventEmitter();
  @Output() toggleFavorite = new EventEmitter();
  @Output() editPost = new EventEmitter();
  userRoles = UserRole;
  constructor() {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
