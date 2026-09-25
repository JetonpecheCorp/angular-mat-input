import { HttpClient } from "@angular/common/http";
import { DOCUMENT, inject, Injectable, signal } from "@angular/core";
import { JP_MAT_INPUT_LANG, SupportedLang } from "angular-mat-input";
import { Observable, tap } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class TraductionService
{
    readonly langue = signal<string>("en");
    private languePossible = ["en", "fr", "it", "es", "pt", "ar", "ja", "nl", "pl", "ru", "sv", "zh"];
    private traduction = signal<Record<string, string>>({});

    private http = inject(HttpClient);
    private document = inject(DOCUMENT);
    private readonly configuredLang = inject(JP_MAT_INPUT_LANG, { optional: true });

    constructor() 
    {
        if (this.configuredLang && this.languePossible.includes(this.configuredLang)) 
        {
            this.setLangue(this.configuredLang);
            return;
        }

        const navLang = (typeof window !== "undefined" && navigator.language) ? navigator.language.toLowerCase() : "en";
        const code = navLang.split("-")[0] as SupportedLang;

        const matchedLang = this.languePossible.includes(code) ? code : "en";
        this.setLangue(matchedLang);
    }

    setLangue(lang: string): void 
    {
        this.langue.set(lang);

        if (typeof document !== "undefined")
        {
            this.document.documentElement.dir = lang == "ar" ? "rtl" : "ltr";
            this.document.documentElement.lang = lang;
        }
    }

    load(): Observable<Record<string, string>> 
    {
        return this.http.get<Record<string, string>>(`assets/translateInputErreur/${this.langue()}.json`).pipe(
            tap((retour) => {
                this.traduction.set(retour ?? {});
            })
        );
    }

    get(key: string): string 
    {
        const dico = this.traduction();
        return dico?.[key] ?? key;
    }
}