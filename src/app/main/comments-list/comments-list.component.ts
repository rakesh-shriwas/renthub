import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
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

@Component({
  selector: 'app-comments',
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss',
})
export class CommentsListComponent implements OnInit {
  service = inject(CommonService);
  loggedInUser = signal({})
  commentFormControl = new FormControl('', [
    Validators.minLength(6),
    this.noWhitespaceValidator,
  ]);

  @Input() comments: ICommentResponse[] = [];
  @Input() isLoading: boolean = false;
  @Output() postComment = new EventEmitter<string>();

  ngOnInit(): void {
    const authenticateUser = this.service.getAuthenticateUser();
    this.loggedInUser.set(authenticateUser);
  }
  postAComment(): void {
    if (this.commentFormControl.valid) {
      this.postComment.emit(this.commentFormControl.value?.trim());
      this.commentFormControl.reset();
    }
  }

  // Custom validator: disallow only-whitespace input
  noWhitespaceValidator(control: AbstractControl) {
    const isValid = (control.value || '').trim().length > 0;
    return isValid ? null : { whitespace: true };
  }
}
