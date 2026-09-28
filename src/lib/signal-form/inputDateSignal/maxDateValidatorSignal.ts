import { SchemaPath, validate } from '@angular/forms/signals';

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
 * Applique une règle de validation de date maximale sur un champ de formulaire Signal Forms.
 * 
 * Si la date saisie dépasse la limite spécifiée, l'erreur retournée aura la clé `maxDate`
 * et contiendra la date maximale au format ISO (YYYY-MM-DD) dans son message.
 *
 * @param chemin Chemin d'accès au champ dans le schéma (`SchemaPath`).
 * @param dateMax Date maximale autorisée. Peut être :
 * - Un objet `Date`
 * - Une chaîne au format ISO (`YYYY-MM-DD`)
 * - Une fonction ou un Signal Angular `() => Date | string` pour une limite dynamique
 *
 * @example
 * // Date fixe sous forme de chaîne
 * maxDate(s.dateFin, '2026-12-31');
 *
 * @example
 * // Limite dynamique calculée au moment de la saisie (ex: aujourd'hui)
 * maxDate(s.dateFin, () => new Date());
 *
 * @example
 * // Liée à un Signal du composant
 * maxDate(s.dateFin, () => this.dateLimite());
 */
export function maxDate(
    path: SchemaPath<Date | string | null | undefined>,
    dateMax: Date | string | (() => Date | string)
): void
{
    validate(path, context =>
    {
        const valeur = context.value();

        if (!valeur)
            return null;

        // Résolution de la limite maximale (supporte valeur statique ou fonction/signal)
        const limite = typeof dateMax === 'function' ? dateMax() : dateMax;
        const dateLimite = limite instanceof Date ? limite : new Date(limite);
        const dateLimiteTexte = limite instanceof Date ? FormaterDateIso(limite) : limite;

        // Résolution de la date saisie
        const dateSaisie = valeur instanceof Date ? valeur : new Date(valeur);

        // Si l'une des deux dates est invalide
        if (isNaN(dateSaisie.getTime()) || isNaN(dateLimite.getTime()))
        {
            return null;
        }

        // Vérification du dépassement
        if (dateSaisie.getTime() > dateLimite.getTime())
        {
            return {
                kind: 'maxDate',
                message: dateLimiteTexte
            };
        }

        return null;
    });
}