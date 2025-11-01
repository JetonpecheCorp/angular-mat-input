import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class TraductionService
{
    private languePossible = ["en", "fr", "it", "es", "pt"];
    private langue = signal<string>("en");
    private traduction = signal<any>(null);

    private http = inject(HttpClient);

    constructor() 
    {
        let langueNav = navigator.language.split("-")[0];

        const INDEX = this.languePossible.findIndex(x => x == langueNav);

        if(INDEX != -1)
            this.langue.set(langueNav);
    }

    load(): Observable<any>
    {
        return this.http.get<{ [key: string]: string }>(`assets/translateInputErreur/${this.langue()}.json`).pipe(
            tap((retour) => 
            {
                this.traduction.set(retour);
            }
        ));
    }

    get(_key: string): string 
    {
        return this.traduction()[_key] || _key;
    }
}