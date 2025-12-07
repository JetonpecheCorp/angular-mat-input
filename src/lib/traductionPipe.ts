import { inject, Pipe, PipeTransform } from '@angular/core';
import { TraductionService } from './traductionService';

@Pipe({
  name: 'traduction',
  standalone: true
})
export class TraductionPipe implements PipeTransform 
{
    private tradServ = inject(TraductionService);

  transform(value: unknown, ...args: unknown[]): unknown 
  { 
    let phrase = this.tradServ.get(value as string);

    if(args.length == 0)
      return phrase;
  
    const VALEUR = args[0] as string;

    if(VALEUR == null || VALEUR == undefined)
      return phrase;

    if(VALEUR.match(/^\d{4}-\d{2}-\d{2}$/))
    {
      let date = new Date(VALEUR).toLocaleString().split(" ")[0];
      return phrase.replace("{var}", date);
    }

    return phrase.replace("{var}", (args[0] as Date).toLocaleString().split(" ")[0]); 
  }
}