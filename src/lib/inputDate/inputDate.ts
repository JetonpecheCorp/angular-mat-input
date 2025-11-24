import { booleanAttribute, Component, input, OnInit, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { EDay } from './EDay';
import { EMonth } from './EMonth';
import { TraductionPipe } from '../traductionPipe';

@Component({
  selector: 'jp-input-date',
  standalone: true,
  templateUrl: './inputDate.html',
  //styleUrl: './input.css',
  providers: [provideNativeDateAdapter()],
  imports: [TraductionPipe, MatDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule]
})
export class InputDate implements ControlValueAccessor, OnInit
{
    label = input<string>();

    /** Changer le logo du picker */
    iconPicker = input<string>();

    /** Mois à bloquer */
    disabledMonths = input<EMonth[]>([]);

    /** Jours de la semaine à bloquer */
    disabledDays = input<EDay[]>([]);

    /**
     * Numéro du jour à bloquer  
     * Ne pas mettre de 0 sur un chiffre (exemple 01 => 1)  
     * format: MM-DD
     */
    disabledDates = input<string[]>([]);
    
    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    touchUi = input(false, { transform: booleanAttribute });
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });

    /** Désactiver l'input mais pas le bouton picker */
    disabledPartial = input(false, { transform: booleanAttribute });

    /** Désactiver le samedi et dimanche */
    disabledWeekend = input(false, { transform: booleanAttribute });

    /** Désactiver tout sauf le samedi et dimanche */
    disabledWeek = input(false, { transform: booleanAttribute });

    /** Désactiver le dimanche et lundi */
    disabledSundayAndMonday = input(false, { transform: booleanAttribute });

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

        let erreur = validator(new FormControl(new Date(0, 0)));
        
        if (erreur?.['minDate']) 
            this.min.set(erreur['minDate']);

        erreur = validator(new FormControl(new Date(9999, 11, 31)));

        if (erreur?.['maxDate']) 
            this.max.set(erreur['maxDate']);
    }

    protected dateFilter: (_date: Date | null) => boolean =
        (_date: Date | null) => 
        {
            if (!_date) 
                return false;
            
            const day = _date.getDay();

            if(this.disabledMonths().includes(_date.getMonth()))
                return false;

            if(this.disabledDays().includes(day))
                return false;

            if(this.disabledWeek())
            {
                if(day != 0 && day != 6)
                    return false;
            }

            if(this.disabledWeekend())
            {
                if(day == 0 || day == 6)
                    return false;
            }

            if(this.disabledSundayAndMonday())
            {
                if(day == 0 || day == 1)
                    return false;
            }

            if(this.disabledDates().length > 0)
            {
                let moisJour = `${_date.getMonth() + 1}-${_date.getDate()}`;

                if(this.disabledDates().includes(moisJour))
                    return false;
            }

            return true;
        };

    // Pas utiliser, sert a rendre compatible pour le constructor
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    setDisabledState(isDisabled: boolean): void {}
    writeValue(obj: any): void {}
}