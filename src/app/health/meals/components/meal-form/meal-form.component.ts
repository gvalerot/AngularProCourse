import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meal } from '../../interfaces/Meal';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'meal-form',
  imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="meal-form">
      <form [formGroup]="form">
        <div class="meal-form__name">
          <label>
            <h3>Meal name</h3>
            <input
              type="text"
              placeholder="e.g. English Breakfast"
              formControlName="name"
            />
            <div class="error" *ngIf="required">Meal name is required</div>
          </label>
        </div>

        <div class="meal-form__food">
          <div class="meal-form__subtitle">
            <h3>Food</h3>
            <button
              type="button"
              class="meal-form__add"
              (click)="addIngredient()"
            >
              <img src="img/add-white.svg" />
              Add food
            </button>
          </div>
          <div formArrayName="ingredients">
            <label *ngFor="let c of ingredients.controls; index as i">
              <input #ingredientInput [formControlName]="i" placeholder="e.g. Eggs" />
              <span class="meal-form__remove" (click)="removeIngredient(i)">
              </span>
            </label>
          </div>
        </div>

        <div class="meal-form__submit">
          <div>
            <button type="button" class="button" *ngIf="!exists"(click)="createMeal()">
              Create meal
            </button>
            <button type="button" class="button" *ngIf="exists" (click)="updateMeal()">
              Save
            </button>
            <a class="button button--cancel" [routerLink]="['../']">Cancel</a>
          </div>

          <div class="meal-form__delete" *ngIf="exists">
            <div *ngIf="toggled">
              <p>Delete item?</p>
              <button type="button" class="confirm" (click)="removeMeal()">
                Yes
              </button>
              <button type="button" class="cancel" (click)="toggle()">
                No
              </button>
            </div>

            <button class="button button--delete" type="button" (click)="toggle()">
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styleUrl: './meal-form.component.scss'
})
export class MealFormComponent implements OnChanges {
  
  form!: FormGroup;

  toggled = false;
  exists = false;

  @Input()
  meal!: Meal;

  @Output()
  create = new EventEmitter<Meal>();
  @Output()
  update = new EventEmitter<Meal>();
  @Output()
  remove = new EventEmitter<Meal>();

  @ViewChildren('ingredientInput')
  ingredientInputs!: QueryList<ElementRef>;

  constructor(private fb: FormBuilder){

    this.form = this.fb.group({
      name: ['', Validators.required],
      ingredients: this.fb.array([''])
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.meal && this.meal.name){
      this.exists = true;
      this.emptyIngredients();

      const value = this.meal;
      this.form.patchValue(value);

      if(value.ingredients){
        for (const item of value.ingredients){
          this.ingredients.push(new FormControl(item));
        }
      }
    }
  }

  get ingredients(){
    return this.form.get('ingredients') as FormArray;
  }

  get required(){
    return(
      this.form.get('name')?.hasError('required') &&
      this.form.get('name')?.touched
    )
  }
  
  createMeal(){
    if(this.form.valid){
      this.create.emit(this.form.value);
    }
  }

  updateMeal(){
    if(this.form.valid){
      this.update.emit(this.form.value);
    }
  }

  removeMeal(){
    this.remove.emit(this.form.value);
  }

  addIngredient(){
    this.ingredients.push(new FormControl(''));

    setTimeout(() => {
      const inputs = this.ingredientInputs.toArray();
      if(inputs.length > 0){
        inputs[inputs.length - 1].nativeElement.focus();
      }
    })
  }

  removeIngredient(index: number){
    this.ingredients.removeAt(index);
  }

  emptyIngredients(){
    while(this.ingredients.controls.length){
      this.ingredients.removeAt(0);
    }
  }

  toggle(){
    this.toggled = !this.toggled;
  }

}
