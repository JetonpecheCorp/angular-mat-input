import { SchemaPath, validate } from '@angular/forms/signals';

export interface PasswordValidatorOptions
{
    message?: string;
    minLength?: number;
}

/**
 * Validateur de mot de passe pour le schéma Signal Forms
 */
export function password(
    path: SchemaPath<string>,
    options?: PasswordValidatorOptions
): void
{
    validate(path, (value) => 
    {
        // En cas de valeur vide, on laisse required gérer l'erreur
        if (!value)
            return null;

        const contientMinuscule = /\p{Ll}/u.test(value.value());
        const contientMajuscule = /\p{Lu}/u.test(value.value());
        const contientChiffre = /\p{N}/u.test(value.value());
        const contientCaractereSpecial = /[\p{P}\p{S}]/u.test(value.value());

        const mdpValide =
            contientMajuscule &&
            contientMinuscule &&
            contientChiffre &&
            contientCaractereSpecial &&
            value.value().length >= (options?.minLength ?? 8);

        if (mdpValide)
            return null;

        return {
            kind: 'password',
            message: options?.message,
            min: options?.minLength ?? 8
        };
    });
}