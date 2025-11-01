import { booleanAttribute, Component, input, OnInit, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TraductionPipe } from '../traductionPipe';

@Component({
  selector: 'jp-input-text',
  standalone: true,
  templateUrl: './inputText.html',
  //styleUrl: './input.css',
  imports: [TraductionPipe, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class InputText implements ControlValueAccessor, OnInit
{
    label = input<string>();
    placeholder = input<string>();
    type = input<string>("text");
    suffixIcon = input<string>();
    prefixIcon = input<string>();

    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    showMaxLength = input(false, { transform: booleanAttribute });
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

    // Pas utiliser, sert a rendre compatible pour le constructor
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    setDisabledState(isDisabled: boolean): void {}
    writeValue(obj: any): void {}
}