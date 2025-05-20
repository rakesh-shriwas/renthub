import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { createPost,  updateExistingPost } from '../../store/renthub.action';
import { selectCreatePostSuccess } from '../../store/renthub.selectors';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-create-post',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './create-post-dialog.component.html',
  styleUrl: './create-post-dialog.component.scss',
})
export class CreatePostDialogComponent implements OnInit, OnDestroy{
 
  private store = inject(Store);
  private service = inject(CommonService);
  readonly dialogRef = inject(MatDialogRef<CreatePostDialogComponent>);
  private destroy$ = new Subject<void>();
  data = inject(MAT_DIALOG_DATA);
  userId: number;

  createPostSuccess$: Observable<boolean> = this.store.select(
    selectCreatePostSuccess
  );
  createPostForm: FormGroup<{
    title: FormControl<string | null>;
    description: FormControl<string | null>;
    apartmentType: FormControl<string | null>;
    name: FormControl<string | null>;
    sharedProperty: FormControl<boolean | null>;
    location: FormControl<string | null>;
    squareFit: FormControl<string | null>;
    stayType: FormControl<string | null>;
    rent: FormControl<string | null>;
    priceMode: FormControl<string | null>;
    rentNegotiable: FormControl<boolean | null>;
    apartmentFurnished: FormControl<boolean | null>;
    amenities: FormArray<FormControl<string>>;
  }>;
  selectedAmenities: string[] = [];
  availableAmenities: string[] = [
    'Gym/Fitness Center',
    'Swimming Pool',
    'Card Park',
    'Visitors Parking',
    'Power Backup',
    'Garbage Disposal',
    'Private Lawn',
    'Water Heater',
    'Plant Security System',
    'Laundry Service',
    'Elevator',
    'Club House',
  ];
  selectedAmenitiesList: string[] = [];

  ngOnInit(): void {
    this.initForm();
    this.addCheckboxes();
    this.createPostSuccess$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.dialogRef.close(res);
        // this.store.dispatch(loadPosts());
      }
    });

    if (this.data) {
      this.createPostForm.patchValue(this.data);
      this.selectedAmenities = this.data.amenities;
      if (this.data?.amenities?.length) {
        this.setEditData(this.data.amenities);
      }
    }
    this.service.getAuthenticateUser().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        this.userId = res?.id;
      }
    });
  }

  initForm(): void {
    this.createPostForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(1400),
      ]),
      apartmentType: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      sharedProperty: new FormControl(true, [Validators.required]),
      location: new FormControl('', [Validators.required]),
      squareFit: new FormControl('', [Validators.required]),
      stayType: new FormControl('long term', [Validators.required]),
      rent: new FormControl('', [Validators.required]),
      priceMode: new FormControl('monthly', [Validators.required]),
      rentNegotiable: new FormControl(false),
      apartmentFurnished: new FormControl(true, [Validators.required]),
      amenities: new FormArray<FormControl<string>>([]),
    });
  }

  get amenitiesFormArray(): FormArray {
    return this.createPostForm.get('amenities') as FormArray;
  }

  // Initialize checkboxes (add all unchecked initially)
  private addCheckboxes() {
    this.availableAmenities.forEach(() =>
      this.amenitiesFormArray.push(new FormControl(false))
    );
  }

  // Get selected amenities as string array
  getSelectedAmenities(): string[] {
    return this.amenitiesFormArray.value
      .map((checked: boolean, i: number) =>
        checked ? this.availableAmenities[i] : null
      )
      .filter((v: string | null) => v !== null) as string[];
  }
  createNewPost(): void {
    const formValue = this.createPostForm.value;
    const selectedAmenities = this.getSelectedAmenities();
    if (this.createPostForm.valid) {
      if(!this.data){
        this.store.dispatch(
          createPost({
            payload: {
              ...formValue,
              userId: this.userId,
              images: [],
              amenities: selectedAmenities,
            },
          })
        );
      }else {
        this.store.dispatch(
          updateExistingPost({
            payload: {
              ...formValue,
              userId: this.userId,
              images: [],
              amenities: selectedAmenities,
            },
            postId: this.data?.id
          })
        );
      }
    } else {
      this.createPostForm.markAllAsTouched();
    }
  }

  setEditData(selectedAmenities: string[]) {
    this.amenitiesFormArray.controls.forEach((control, index) => {
      control.setValue(
        selectedAmenities.includes(this.availableAmenities[index])
      );
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
