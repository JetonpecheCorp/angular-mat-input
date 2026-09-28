import { booleanAttribute, Component, input, output, signal, model, ChangeDetectionStrategy, effect, untracked, computed } from '@angular/core';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AutocompleteDataSource } from '../../AutocompleteDataSource';
import { TraductionPipe } from '../../traductionPipe';
import { MatOptionModule } from '@angular/material/core';
import { FieldTree, ValidationError } from '@angular/forms/signals';

@Component({
    selector: 'jp-signal-autocomplete',
    standalone: true,
    templateUrl: './inputAutocompleteSignal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatOptionModule, TraductionPipe, MatAutocompleteModule, MatFormFieldModule, MatInputModule]
})
export class InputAutocompleteSignal
{
    readonly field = input.required<FieldTree<any>>();

    /** Event autocomplete value changed */
    autocompleteChange = output<string>();

    /** Event autocomplete opened */
    opened = output<void>();

    /** Event autocomplete closed */
    closed = output<void>();

    label = input<string>();
    placeholder = input<string>();
    dataSource = model.required<AutocompleteDataSource[]>();

    matAutocompletePosition = input<"auto" | "above" | "below">("auto");

    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });
    autoDesactiveFirstOption = input(false, { transform: booleanAttribute });
    requireSelection = input(false, { transform: booleanAttribute });
    disabledFilterComplete = input(false, { transform: booleanAttribute });

    protected dataSourceClone = signal<AutocompleteDataSource[]>([]);

    constructor()
    {
        effect(() =>
        {
            const data = this.dataSource();
            untracked(() =>
            {
                this.dataSourceClone.set(data);
            });
        });
    }

    protected valeurAffichee = computed(() =>
    {
        const val = this.field()().value();
        const option = this.dataSource().find(x => x.value == val);
        return option ? option.display : (val ?? '');
    });

    protected estDesactive = computed<boolean>(() =>
    {
        const etat = this.field()() as any;
        return etat.disabled();
    });

    /** Liste des erreurs indexées par kind */
    protected listeErreur = computed(() =>
    {
        const erreurs = this.field()().errors() ?? [];
        const map: Record<string, ValidationError.WithFieldTree> = {};

        for (const element of erreurs)
        {
            map[element.kind] = element;
        }

        return map;
    });

    protected AffichageMatOption(option: AutocompleteDataSource): string
    {
        return option && option.display ? option.display : "";
    }

    protected AutoCompleteOuvert(): void
    {
        const val = this.field()().value();

        if (!val && !this.disabledFilterComplete())
            this.dataSourceClone.set(this.dataSource());

        this.opened.emit();
    }

    protected Filtrer(event: Event): void
    {
        const valeur = (event.target as HTMLInputElement).value;
        const fieldState = this.field()() as any;

        // Mise à jour de l'arbre Signal Forms
        if (this.requireSelection())
        {
            if (typeof fieldState?.value?.set == 'function')
                fieldState.value.set(null);
        } 
        else
        {
            if (typeof fieldState?.value?.set == 'function')
                fieldState.value.set(valeur);
        }

        this.autocompleteChange.emit(valeur);

        if (!this.disabledFilterComplete())
        {
            const VALEUR = valeur.toLowerCase();
            const LISTE = this.dataSource().filter(x => x.display.toLowerCase().includes(VALEUR));
            this.dataSourceClone.set(LISTE);
        }
    }

    protected OptionChoisi(event: MatAutocompleteSelectedEvent): void
    {
        const selectedOption: AutocompleteDataSource = event.option.value;
        const fieldState = this.field()() as any;

        if (typeof fieldState?.value?.set == 'function')
            fieldState.value.set(selectedOption.value);
    }

    protected Blur(): void
    {
        const fieldState = this.field()() as any;

        if (typeof fieldState?.markAsTouched == 'function')
            fieldState.markAsTouched();
    }
}
