import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Un validateur personnalisé qui vérifie la conformité d'un mot de passe
 * @returns Une fonction de validation.
 */
export function passwordValidator(): ValidatorFn 
{
    return (control: AbstractControl): ValidationErrors | null => 
    {
        const value = control.value;

        // y compris les accents
        const contientMinuscule = /\p{Ll}/u.test(value);

        // y compris les accents
        const contientMajuscule = /\p{Lu}/u.test(value);

        // \p{N} est l'équivalent Unicode de \d
        const contientChiffre = /\p{N}/u.test(value); 

        // Ponctuation ou Symbole
        const contientCaractereSpecial = /[\p{P}\p{S}]/u.test(value); 

        const mdpValide = contientMajuscule && contientMinuscule && contientChiffre && contientCaractereSpecial && value.length >= 8;

        return mdpValide ? null : { password: true };
    };
}