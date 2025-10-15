import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormBuilder, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';

import { Survey as surveyService } from '../../../../services/modals/survey/survey';
import { Dialogs } from '../../../../services/messages/dialogs';
import { IsurveyData } from '../../../../interfaces/survey/isurvey-data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-survey',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './survey.html',
  styleUrl: './survey.scss'
})
export class Survey implements OnDestroy, OnInit {

  public gameId: number = 0;
  public loading: boolean = false;
  public showModal: boolean = false;

  private options: string[] = ['Dificultad', 'Usabilidad', 'Diseño'];

  private modalsubscription: Subscription | undefined;

  public surveyForm!: FormGroup<{
    name: FormControl<string>;
    surname: FormControl<string>;
    age: FormControl<number | null>;
    telephone: FormControl<string | null>;
    gameRating: FormControl<string | null>;
    gameAspects: FormArray<FormControl<boolean>>;
    comments: FormControl<string | null>;
  }>

  constructor(private dialogs: Dialogs, private formBuilder: FormBuilder, private surveyService: surveyService) { }

  ngOnInit(): void {
    this.surveyForm = this.formBuilder.group({
      name: this.formBuilder.control('', {
        validators: [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ\u00f1\u00d1 ]+$/)],
        updateOn: 'blur'
      }),
      surname: this.formBuilder.control('', {
        validators: [Validators.required, Validators.pattern(/^[A-Za-zÀ-ÿ\u00f1\u00d1 ]+$/)],
        updateOn: 'blur'
      }),
      age: this.formBuilder.control<number | null>(null, {
        validators: [Validators.required, Validators.min(19), Validators.max(98)],
        updateOn: 'change'
      }),
      telephone: this.formBuilder.control<string | null>(null, {
        validators: [Validators.required, Validators.minLength(10), Validators.maxLength(10)],
        updateOn: 'change'
      }),
      gameRating: this.formBuilder.control<string | null>(null, {
        validators: [Validators.required],
        updateOn: 'change'
      }),
      gameAspects: this.formBuilder.array([
        this.formBuilder.control(false),
        this.formBuilder.control(false),
        this.formBuilder.control(false),
      ], {
        // valida que al menos se seleccione un checkBox
        validators: [this.minSelectedCheckboxes(1)],
        updateOn: 'change'
      }),
      comments: this.formBuilder.control<string | null>(null, {
        validators: [Validators.required, Validators.minLength(10), Validators.maxLength(150)],
        updateOn: 'change'
      })
    }) as FormGroup<any>;

    this.modalsubscription = this.surveyService.observableModalState$.subscribe(modalState => {
      this.showModal = modalState.show;
      this.gameId = modalState.gameId;

      // reset de los valores del formulario
      if (modalState.show) {
        this.surveyForm.reset({
          name: '',
          surname: '',
          age: null,
          telephone: null,
          gameRating: null,
          comments: null
        });

        // reset de los valores del array
        this.gameAspects.controls.forEach(control => control.setValue(false));
      }
    });
  }

  // GETTERS
  get name(): FormControl<string> {
    return this.surveyForm.controls.name;
  }

  get surname(): FormControl<string> {
    return this.surveyForm.controls.surname;
  }

  get age(): FormControl<number | null> {
    return this.surveyForm.controls.age;
  }

  get telephone(): FormControl<string | null> {
    return this.surveyForm.controls.telephone;
  }

  get gameRating(): FormControl<string | null> {
    return this.surveyForm.controls.gameRating;
  }

  get gameAspects(): FormArray<FormControl<boolean>> {
    return this.surveyForm.controls.gameAspects as FormArray<FormControl<boolean>>;
  }

  get comments(): FormControl<string | null> {
    return this.surveyForm.controls.comments;
  }

  public async onSubmit(): Promise<void> {
    if (this.surveyForm.invalid) {
      this.surveyForm.markAllAsTouched();
      return;
    }

    // muestro el spinner
    this.loading = true;

    const selectedAspects: string[] = [];

    this.gameAspects.controls.forEach((control, index) => {
      if (control.value === true) {
        selectedAspects.push(this.options[index]);
      }
    });

    try {
      // guardo los datos del formulario
      const surveyData: IsurveyData = {
        name: this.name.value,
        surname: this.surname.value,
        age: this.age.value || 0,
        telephone: this.telephone.value || '',
        game_rating: this.gameRating.value ? parseInt(this.gameRating.value, 10) : 0,
        game_aspects: selectedAspects,
        comments: this.comments.value,
        game_id: this.gameId
      }

      // guardo los datos de la encuesta
      await this.surveyService.saveSurvey(surveyData);

      // cierro el modal
      this.surveyService.closeSurveyModal();
      
      // oculto el spinner
      this.loading = false;

      // muestro mensaje exitoso
      await this.dialogs.showDialogMessage({
        title: 'Games Room',
        content: 'Encuesta enviada con exito. Gracias por responder!'
      });
    }
    catch (error: unknown) {
      // error para debug
      console.error('[survey component] Error al enviar la encuesta: ', error);

      this.surveyService.closeSurveyModal();
      
      await this.dialogs.showDialogMessage({
        title: 'Games Room',
        content: 'La encuesta no se pudo enviar.'
      });
    }
    finally {
      this.loading = false;
    }
  }

  // valida si selecciona opciones
  private minSelectedCheckboxes(min: number): ValidatorFn {
    const validator: ValidatorFn = (formArray: AbstractControl) => {

      // cuento los checks seleccionados
      if (formArray instanceof FormArray) {
        const checkedCount = formArray.controls
        .map(control => control.value)
        .reduce((acc, value) => value ? acc + 1 : acc, 0);

        // si el conteo es menor que el requerido, devuelve el error 'minSelection'
        return checkedCount >= min ? null : { minSelection: { required: min, actual: checkedCount } };
      }

      return null;
    };

    return validator;
  }

  // cierra el modal
  public onClose(): void {
    this.surveyService.closeSurveyModal();
  }

  ngOnDestroy(): void {
    this.modalsubscription?.unsubscribe();
  }
}
