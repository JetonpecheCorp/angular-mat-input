import { booleanAttribute, Component, input, OnInit, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TraductionPipe } from '../traductionPipe';

@Component({
  selector: 'jp-input-password',
  standalone: true,
  templateUrl: './inputPassword.html',
  //styleUrl: './inputNumber.css',
  imports: [TraductionPipe, MatButtonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class InputPassword implements ControlValueAccessor, OnInit
{
    label = input<string>();
    placeholder = input<string>();

    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });
    hiddenButtonSwitch = input(false, { transform: booleanAttribute });
    showMaxLength = input(false, { transform: booleanAttribute });

    protected estCacher = signal<boolean>(true);
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

    protected ClickEvent(_event: Event): void
    {
        this.estCacher.set(!this.estCacher());
        _event.stopPropagation();
    }

    // Pas utiliser, sert a rendre compatible pour le constructor
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    setDisabledState(isDisabled: boolean): void {}
    writeValue(obj: any): void {}
}
