import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute, OnInit, output, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { TraductionPipe } from '../../traductionPipe';

@Component({
  selector: 'jp-input-number',
  standalone: true,
  templateUrl: './inputNumber.html',
  styleUrl: './inputNumber.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TraductionPipe, NgClass, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class InputNumber implements ControlValueAccessor, OnInit
{
    /**
     * Floating label text displayed above the input field.
     */
    label = input<string>();

    /**
     * Placeholder text displayed when the input field is empty.
     * @default ''
     */
    placeholder = input<string>('');

    /**
     * Stepping interval used for incremental numerical adjustments.
     * Transformed automatically from a string or number input.
     * @default 0
     */
    step = input<number>(0, { transform: numberAttribute });

    /**
     * Supplementary descriptive text displayed below the input field.
     */
    hint = input<string>();

    /**
     * Material icon name displayed after the input field.
     */
    suffixIcon = input<string>();

    /**
     * Material icon name displayed before the input field.
     */
    prefixIcon = input<string>();

    /**
     * Emits when a prefix or suffix icon button is clicked.
     */
    clicked = output<void>();

    /**
     * Whether prefix or suffix icons should be rendered as clickable icon buttons.
     * @default false
     */
    isBtnIcon = input(false, { transform: booleanAttribute });

    /**
     * Floating label behavior forwarded to MatFormField.
     * @default 'always'
     */
    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });

    /**
     * Whether to hide the required asterisk marker on the label.
     * @default false
     */
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });

    /**
     * Whether to hide the increment and decrement spinner arrows on number inputs.
     * @default false
     */
    hiddenArrows = input(false, { transform: booleanAttribute });

    /**
     * Text align right on input number
     * @default false
     */
    textRight = input(false, { transform: booleanAttribute });

    protected min = signal<number | null>(null);
    protected max = signal<number | null>(null);

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

        let erreur = validator(new FormControl(-Infinity));

        if (erreur?.['min']) 
            this.min.set(erreur['min'].min);

        erreur = validator(new FormControl(Infinity));

        if (erreur?.['max']) 
            this.max.set(erreur['max'].max);    
    }

    protected Btnclicker(): void
    {
        if(this.clicked)
            this.clicked.emit();
    }

    // Pas utiliser, sert a rendre compatible pour le constructor
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    setDisabledState(isDisabled: boolean): void {}
    writeValue(obj: any): void {}
}