import { inject, Pipe, PipeTransform } from '@angular/core';
import { TraductionService } from './traductionService';

@Pipe({
    name: 'traduction',
    standalone: true
})
export class TraductionPipe implements PipeTransform 
{
    private tradServ = inject(TraductionService);

    transform(value: unknown, ...args: any[]): string 
    {
        if (typeof value !== "string")
            return '';

        let phrase = this.tradServ.get(value);

        if (args.length === 0 || args[0] === undefined || args[0] === null)
            return phrase;

        const valeur = args[0];
        const langueActuelle = this.tradServ.langue();

        if (valeur instanceof Date)
        {
            const dateStr = new Intl.DateTimeFormat(langueActuelle).format(valeur);
            return phrase.replace("{var}", dateStr);
        }

        // 2. Cas d'une date ISO "YYYY-MM-DD"
        if (typeof valeur === "string" && /^\d{4}-\d{2}-\d{2}$/.test(valeur))
        {
            const [annee, mois, jour] = valeur.split("-").map(Number);
            const date = new Date(annee, mois - 1, jour);
            const dateStr = new Intl.DateTimeFormat(langueActuelle).format(date);
            return phrase.replace("{var}", dateStr);
        }

        return phrase.replace("{var}", String(valeur));
    }
}