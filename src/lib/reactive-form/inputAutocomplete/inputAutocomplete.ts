import { booleanAttribute, Component, input, OnInit, output, signal, Self, model, OnChanges, SimpleChanges, ChangeDetectionStrategy, viewChild, ElementRef, computed } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AutocompleteDataSource } from '../../AutocompleteDataSource';
import { TraductionPipe } from '../../traductionPipe';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { F } from '@angular/cdk/keycodes';

@Component({
    selector: 'jp-autocomplete',
    standalone: true,
    templateUrl: './inputAutocomplete.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatOptionModule, MatIconModule, MatChipsModule, TraductionPipe, MatAutocompleteModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule]
})
export class InputAutocomplete implements ControlValueAccessor, OnInit, OnChanges
{
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
    multiple = input(false, { transform: booleanAttribute });

    protected dataSourceClone = signal<AutocompleteDataSource[]>([]);
    protected formControlInterne = new FormControl();
    protected parentValue = signal<any>(null);

    private champSaisie = viewChild<ElementRef<HTMLInputElement>>('champSaisie');

    private onChange = (value: any) => { };
    private onTouched = () => { };

    protected get control() 
    {
        return this.ngControl.control;
    }

    protected listeChipAffiche = computed(() => 
    {
        if (!this.multiple())
            return [];

        const valeurs = this.parentValue();
        if (!Array.isArray(valeurs))
            return [];

        return valeurs.map(val =>
        {
            const trouve = this.dataSource().find(x => x.value === val);
            return trouve ? trouve : { value: val, display: String(val) };
        });
    });

    protected listeValeurSelectionner = computed<any[]>(() => 
    {
        if (!this.multiple())
            return [];

        const val = this.parentValue();
        return Array.isArray(val) ? val : [];
    });

    constructor(@Self() private ngControl: NgControl) 
    {
        this.ngControl.valueAccessor = this;
    }

    ngOnInit(): void 
    {
        if (this.ngControl.control?.hasValidator(Validators.required))
            this.formControlInterne.setValidators(Validators.required);
    }

    ngOnChanges(changes: SimpleChanges): void
    {
        if (changes["dataSource"])
        {
            this.dataSourceClone.set(changes["dataSource"].currentValue);

            if (this.ngControl.control?.value && !changes["dataSource"].firstChange)
            {
                if (!this.multiple())
                {
                    let info = this.dataSource().find(x => x.value == this.ngControl.control?.value);
                    this.formControlInterne.setValue(info, { emitEvent: false });
                }
            }
        }
    }

    protected EstRequis(): boolean
    {
        return this.control?.hasValidator(Validators.required) ?? false;
    }

    protected AffichageMatOption = (_option: AutocompleteDataSource): string =>
    {
        if (this.multiple())
            return "";

        return _option && _option.display ? _option.display : "";
    }

    protected AutoCompleteOuvert(): void
    {
        if (!this.formControlInterne.value && !this.disabledFilterComplete())
            this.dataSourceClone.set(this.dataSource());

        this.opened.emit();
    }

    protected Filtrer(_event: Event): void
    {
        let valeur = (_event.target as HTMLInputElement).value;

        // On ne met à jour le parent via frappe clavier qu'en mode simple
        if (!this.multiple())
            this.onChange(this.requireSelection() ? null : valeur);

        this.autocompleteChange.emit(valeur);

        if (!this.disabledFilterComplete())
        {
            const VALEUR = valeur.toLowerCase();
            const LISTE = this.dataSource().filter(x => x.display.toLowerCase().includes(VALEUR));
            this.dataSourceClone.set(LISTE);
        }
    }

    protected OptionChoisi(_event: MatAutocompleteSelectedEvent): void
    {
        const selectedOption: AutocompleteDataSource = _event.option.value;

        if (this.multiple())
        {
            const currentValues = Array.isArray(this.parentValue()) ? this.parentValue() : [];

            if (!currentValues.includes(selectedOption.value))
            {
                const newValues = [...currentValues, selectedOption.value];
                this.parentValue.set(newValues);
                this.onChange(newValues);
            }

            // On vide le champ de saisie
            const inputElement = this.champSaisie()?.nativeElement;
            if (inputElement)
                inputElement.value = '';

            this.formControlInterne.setValue('', { emitEvent: false });

            if (!this.disabledFilterComplete())
                this.dataSourceClone.set(this.dataSource());
        } 
        else
        {
            this.parentValue.set(selectedOption.value);
            this.onChange(selectedOption.value);
        }
    }

    protected RetirerChip(valeurASupprimer: any): void
    {
        const currentValues = Array.isArray(this.parentValue()) ? this.parentValue() : [];
        const newValues = currentValues.filter((val: any) => val !== valeurASupprimer);
        
        this.parentValue.set(newValues);
        this.onChange(newValues);
    }

    protected Blur(): void 
    {
        this.onTouched();
    }

    writeValue(value: any): void 
    {
        this.parentValue.set(value);

        if (!this.multiple()) 
        {
            const OPTION = this.dataSource().find(x => x.value == value);
            this.formControlInterne.setValue(OPTION, { emitEvent: false });
        }
    }

    registerOnChange(fn: any): void 
    {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void 
    {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void 
    {
        isDisabled ? this.formControlInterne.disable() : this.formControlInterne.enable();
    }
}
