import { SchemaPath, validate, ValidationError } from '@angular/forms/signals';

function FormaterDateIso(date: Date): string 
{
    let numJour: any = date.getDate();
    let numMois: any = date.getMonth() + 1;

    if (numJour < 10)
        numJour = `0${numJour}`;

    if (numMois < 10)
        numMois = `0${numMois}`;

    return `${date.getFullYear()}-${numMois}-${numJour}`;
}

/**
 * Applique une règle de validation de date minimale sur un champ de formulaire Signal Forms.
 * 
 * Si la date saisie est antérieure à la limite spécifiée, l'erreur retournée aura la clé `minDate`
 * et contiendra la date minimale au format ISO (YYYY-MM-DD) dans son message.
 *
 * @param chemin Chemin d'accès au champ dans le schéma (`SchemaPath`).
 * @param dateMin Date minimale autorisée. Peut être :
 * - Un objet `Date`
 * - Une chaîne au format ISO (`YYYY-MM-DD`)
 * - Une fonction ou un Signal Angular `() => Date | string` pour une limite dynamique
 *
 * @example
 * // Date fixe sous forme de chaîne
 * minDate(s.dateDebut, '2026-01-01');
 *
 * @example
 * // Limite dynamique calculée au moment de la saisie (ex : aujourd'hui)
 * minDate(s.dateDebut, () => new Date());
 *
 * @example
 * // Liée à un Signal du composant
 * minDate(s.dateDebut, () => this.dateLimiteMin());
 */
export function minDate(
    chemin: SchemaPath<Date | string | null | undefined>,
    dateMin: Date | string | (() => Date | string)
): void 
{
    validate(chemin, context => 
    {
        const valeur = context.value();

        if (!valeur)
            return null;

        const limite = typeof dateMin === 'function' ? dateMin() : dateMin;
        const dateLimite = limite instanceof Date ? limite : new Date(limite);
        const dateLimiteTexte = limite instanceof Date ? FormaterDateIso(limite) : limite;

        const dateSaisie = valeur instanceof Date ? valeur : new Date(valeur);

        if (isNaN(dateSaisie.getTime()) || isNaN(dateLimite.getTime()))
            return null;

        if (dateSaisie.getTime() < dateLimite.getTime()) 
        {
            return {
                kind: 'minDate',
                message: dateLimiteTexte
            };
        }

        return null;
    });
}