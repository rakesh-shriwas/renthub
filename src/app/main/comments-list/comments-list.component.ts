import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ICommentResponse } from '../../models/comment.vm';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-comments',
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    DatePipe,
  ],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss',
})
export class CommentsListComponent implements OnInit, OnDestroy {

  service = inject(CommonService);
  loggedInUser = signal<boolean>(false);
  commentFormControl = new FormControl('', [
    Validators.minLength(2),
    this.noWhitespaceValidator,
  ]);
  private destroy$ = new Subject<void>();

  @Input() comments: ICommentResponse[] = [];
  @Input() isLoading: boolean = false;
  @Output() postComment = new EventEmitter<string>();

  ngOnInit(): void {
    this.service.getAuthenticateUser().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.loggedInUser.set(true);
      }else {
        this.loggedInUser.set(false);
      }
    });
  }

  /**
   * Post a comment
   *
   * @memberof CommentsListComponent
   */
  postAComment(): void {
    if (this.commentFormControl.valid) {
      this.postComment.emit(this.commentFormControl.value?.trim());
      this.commentFormControl.reset();
    }
  }

  noWhitespaceValidator(control: AbstractControl) {
    const isValid = (control.value || '').trim().length > 0;
    return isValid ? null : { whitespace: true };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
