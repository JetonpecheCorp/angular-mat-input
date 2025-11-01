import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Un validateur personnalisé qui vérifie la conformité d'un mot de passe
 * @returns Une fonction de validation.
 */
export function maxDateValidator(_date: Date | string): ValidatorFn 
{
    return (control: AbstractControl): ValidationErrors | null => 
    {
        const value = control.value;
        
        if(typeof _date === "string")
            return value > new Date(_date) ? { maxDate: _date } : null; 

        let numJour: any = _date.getDate();
        let numMois: any = _date.getMonth() + 1;

        if(numJour < 10)
            numJour = `0${numJour}`;

        if(numMois < 10)
            numMois = `0${numMois}`;

        const DATE = `${_date.getFullYear()}-${numMois}-${numJour}`;

        return value > _date ? { maxDate: DATE } : null;
    };
}