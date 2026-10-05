import { booleanAttribute, ChangeDetectionStrategy, Component, input, OnInit, output, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TraductionPipe } from '../../traductionPipe';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'jp-input-text',
  standalone: true,
  templateUrl: './inputText.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TraductionPipe, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class InputText implements ControlValueAccessor, OnInit
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
     * Native input element type (e.g., 'text', 'password', 'email', 'tel').
     * @default 'text'
     */
    type = input<string>('text');

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
     * Whether to display the character counter hint when a maximum length is defined.
     * @default false
     */
    showMaxLength = input(false, { transform: booleanAttribute });

    /**
     * Whether to hide the required asterisk marker on the label.
     * @default false
     */
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });

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