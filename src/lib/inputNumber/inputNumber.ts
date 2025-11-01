import { booleanAttribute, Component, input, OnInit, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { TraductionPipe } from '../traductionPipe';

@Component({
  selector: 'jp-input-number',
  standalone: true,
  templateUrl: './inputNumber.html',
  styleUrl: './inputNumber.css',
  imports: [TraductionPipe, NgClass, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class InputNumber implements ControlValueAccessor, OnInit
{
    label = input<string>();
    placeholder = input<string>();
    suffixIcon = input<string>();
    prefixIcon = input<string>();
    step = input<number | null>(null);

    textRight = input(false, { transform: booleanAttribute });
    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });
    hiddenArrows = input(false, { transform: booleanAttribute });

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

    // Pas utiliser, sert a rendre compatible pour le constructor
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    setDisabledState(isDisabled: boolean): void {}
    writeValue(obj: any): void {}
}