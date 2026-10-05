import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute, OnInit, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TraductionPipe } from '../../traductionPipe';

@Component({
  selector: 'jp-textarea',
  standalone: true,
  templateUrl: './inputTextarea.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TraductionPipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class InputTextarea implements ControlValueAccessor, OnInit
{
    /**
     * Floating label text displayed above the textarea.
     */
    label = input<string>();

    /**
     * Supplementary descriptive text displayed below the textarea.
     */
    hint = input<string>();

    /**
     * Placeholder text displayed when the textarea is empty.
     * @default ''
     */
    placeholder = input<string>('');

    /**
     * Number of visible text lines for the textarea.
     * Transformed automatically from a string or number input.
     * @default null
     */
    rows = input<number | null, unknown>(null, { transform: numberAttribute });

    /**
     * Visible width of the text control in average character widths.
     * Transformed automatically from a string or number input.
     * @default null
     */
    cols = input<number | null, unknown>(null, { transform: numberAttribute });

    /**
     * Floating label behavior forwarded to MatFormField.
     * @default 'always'
     */
    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });

    /**
     * Whether to display the character counter hint when a maximum length is defined.
     * @default false
     */
    showMaxLength = input(false, { transform: booleanAttribute });

    /**
     * Whether to hide the required asterisk marker on the label.
     * @default false
     */
    readonly hiddenRequiredMarker = input(false, { transform: booleanAttribute });

    protected minLength = signal<number | null>(null);
    protected maxLength = signal<number | null>(null);

    protected get control(): FormControl 
    {
        return this.ngControl?.control as FormControl;
    }

    // @Self() garantit qu'on récupère l'instance de NgControl de notre propre élément.
    constructor(@Self() private ngControl: NgControl) 
    {
        // On lie l'implémentation du ControlValueAccessor de notre composant
        // à la directive NgControl d'Angular.
        this.ngControl.valueAccessor = this;
    }

    ngOnInit(): void 
    {
        const validator = this.ngControl.control?.validator;
    
        if(!validator)
        return;

        let erreur = validator(new FormControl());

        if (erreur?.['minlength']) 
            this.minLength.set(erreur['minlength'].requiredLength);

        erreur = validator(new FormControl('a'.repeat(10_000)));

        if (erreur?.['maxlength']) 
            this.maxLength.set(erreur['maxlength'].requiredLength);    
    }

    // Pas utiliser, sert a rendre compatible pour le constructor
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    setDisabledState(isDisabled: boolean): void {}
    writeValue(obj: any): void {}
}