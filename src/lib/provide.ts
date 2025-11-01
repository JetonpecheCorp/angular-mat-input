import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from "@angular/core";
import { TraductionService } from "./traductionService";

export function provideJpMatInput(): EnvironmentProviders
{
    return makeEnvironmentProviders([
        provideAppInitializer(() => inject(TraductionService).load())
    ]);
}