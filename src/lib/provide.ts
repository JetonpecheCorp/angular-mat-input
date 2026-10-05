import { EnvironmentProviders, inject, InjectionToken, makeEnvironmentProviders, provideAppInitializer } from "@angular/core";
import { TraductionService } from "./traductionService";
import { EVENT_MANAGER_PLUGINS } from "@angular/platform-browser";
import { DebounceEventPlugin } from "./events/DebounceEventPlugin";

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
        {
            provide: EVENT_MANAGER_PLUGINS,
            multi: true,
            useClass: DebounceEventPlugin
        },
        provideAppInitializer(() => inject(TraductionService).load())
    ]);
}