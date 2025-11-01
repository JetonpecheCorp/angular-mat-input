import { HttpClient } from '@angular/common/http';
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

    if(args)
      return phrase.replace("{var}", args[0] as string);

    return phrase;
  }
}