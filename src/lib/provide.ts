import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders, provideAppInitializer } from "@angular/core";
import { TraductionService } from "./traductionService";

export interface JpMatInputConfig {
    lang?: SupportedLang;
}

export type SupportedLang = "en" | "fr" | "it" | "es" | "pt" | "ar" | "ja" | "nl" | "pl" | "ru" | "sv" | "zh";
export const JP_MAT_INPUT_LANG = new InjectionToken<SupportedLang | undefined>("JP_MAT_INPUT_LANG");

export function provideJpMatInput(config?: JpMatInputConfig): EnvironmentProviders
{
    return makeEnvironmentProviders([
        {
            provide: JP_MAT_INPUT_LANG,
            useValue: config?.lang
        },
        provideAppInitializer(() => inject(TraductionService).load())
    ]);
}