import { booleanAttribute, Component, input, output, signal, model, ChangeDetectionStrategy, effect, untracked, computed, ElementRef, viewChild } from '@angular/core';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AutocompleteDataSource } from '../../AutocompleteDataSource';
import { TraductionPipe } from '../../traductionPipe';
import { MatOptionModule } from '@angular/material/core';
import { FieldTree, ValidationError } from '@angular/forms/signals';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'jp-signal-autocomplete',
    standalone: true,
    templateUrl: './inputAutocompleteSignal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconModule, MatOptionModule, MatChipsModule, TraductionPipe, MatAutocompleteModule, MatFormFieldModule, MatInputModule]
})
export class InputAutocompleteSignal
{
    readonly field = input.required<FieldTree<unknown>>();

    /** Event autocomplete value changed */
    autocompleteChange = output<string>();

    /** Event autocomplete opened */
    opened = output<void>();

    /** Event autocomplete closed */
    closed = output<void>();

    label = input<string>();
    placeholder = input<string>();
    dataSource = model.required<AutocompleteDataSource[]>();

    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });
    autoDesactiveFirstOption = input(false, { transform: booleanAttribute });
    requireSelection = input(false, { transform: booleanAttribute });
    disabledFilterComplete = input(false, { transform: booleanAttribute });
    multiple = input(false, { transform: booleanAttribute });

    protected dataSourceClone = signal<AutocompleteDataSource[]>([]);
    private champSaisie = viewChild<ElementRef<HTMLInputElement>>('champSaisie');

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

    protected listeChipAffiche = computed(() => 
    {
        if (!this.multiple())
            return [];

        const valeurs = this.field()().value() as any[];
        if (!Array.isArray(valeurs))
            return [];

        return valeurs.map(val =>
        {
            const trouve = this.dataSource().find(x => x.value == val);
            return trouve ? trouve : { value: val, display: String(val) };
        });
    });

    protected valeursSelectionnees = computed<any[]>(() => 
    {
        if (!this.multiple())
            return [];

        const val = this.field()().value();
        return Array.isArray(val) ? val : [];
    });

    protected valeurAffichee = computed(() => 
    {
        if (this.multiple())
            return "";

        const val = this.field()().value();
        const option = this.dataSource().find(x => x.value === val);
        return option ? option.display : (val ?? "");
    });

    protected estDesactive = computed<boolean>(() => this.field()().disabled());

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

    protected EstRequis(): boolean
    {
        return this.field()().required();
    }

    protected AffichageMatOption = (option: AutocompleteDataSource | null): string => 
    {
        if (this.multiple())
            return "";

        return option && option.display ? option.display : "";
    };

    protected AutoCompleteOuvert(): void
    {
        const val = this.field()().value();

        if (!val && !this.disabledFilterComplete())
            this.dataSourceClone.set(this.dataSource());

        this.opened.emit();
    }

    protected Filtrer(event: Event): void
    {
        const inputElement = event.target as HTMLInputElement;
        const valeur = inputElement.value;
        const fieldState = this.field()() as any;

        // En mode multiple, taper au clavier ne modifie que la recherche, pas la valeur du formulaire
        if (!this.multiple())
        {
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

        if (typeof fieldState?.value?.set === 'function')
        {
            if (this.multiple())
            {
                const currentValues = (fieldState.value() || []) as any[];
                if (!currentValues.includes(selectedOption.value))
                    fieldState.value.set([...currentValues, selectedOption.value]);

                // On vide le champ de recherche via le viewChild
                const inputElement = this.champSaisie()?.nativeElement;
                if (inputElement)
                    inputElement.value = '';

                if (!this.disabledFilterComplete())
                    this.dataSourceClone.set(this.dataSource());
            }
            else
                fieldState.value.set(selectedOption.value);
        }
    }

    protected AjouterChipLibre(event: MatChipInputEvent): void 
    {
        if (this.requireSelection())
            return;

        const valeur = (event.value || '').trim();

        if (valeur)
        {
            const fieldState = this.field()() as any;

            if (typeof fieldState?.value?.set === 'function') 
            {
                const valeurActuelle = (fieldState.value() || []) as any[];

                const optionExistante = this.dataSource().find(x => x.display.toLowerCase() === valeur.toLowerCase());
                const valeurFinale = optionExistante ? optionExistante.value : valeur;

                if (!valeurActuelle.includes(valeurFinale))
                    fieldState.value.set([...valeurActuelle, valeurFinale]);

                event.chipInput!.clear();

                if (!this.disabledFilterComplete())
                    this.dataSourceClone.set(this.dataSource());
            }
        }
    }

    protected RetirerChip(valeurASupprimer: any): void 
    {
        const fieldState = this.field()() as any;

        if (typeof fieldState?.value?.set == 'function')
        {
            const currentValues = (fieldState.value() || []) as any[];
            fieldState.value.set(currentValues.filter(val => val !== valeurASupprimer));
        }
    }

    protected Blur(): void
    {   
        this.field()().markAsTouched();
    }
}
