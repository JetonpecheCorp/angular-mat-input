import { booleanAttribute, Component, input, linkedSignal, OnInit, output, Self, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelType, MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AutocompleteDataSource } from './AutocompleteDataSource';
import { TraductionPipe } from '../traductionPipe';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'jp-autocomplete',
  standalone: true,
  templateUrl: './inputAutocomplete.html',
  imports: [MatOptionModule, TraductionPipe, MatAutocompleteModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule]
})
export class InputAutocomplete implements ControlValueAccessor, OnInit
{
    formField = viewChild.required<MatFormField>("matTest");

    /** Event autocomplete value changed */
    autocompleteChange = output<string>(); 

    /** Event autocomplete opened */
    opened = output<void>();

    /** Event autocomplete closed */
    closed = output<void>();

    label = input<string>();
    placeholder = input<string>();
    dataSource = input<AutocompleteDataSource[]>();

    matAutocompletePosition = input<"auto" | "above" | "below">("auto");
    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });
    autoDesactiveFirstOption = input(false, { transform: booleanAttribute });
    requireSelection = input(false, { transform: booleanAttribute });
    disabledFilterComplete = input(false, { transform: booleanAttribute });

    protected dataSourceClone = linkedSignal<AutocompleteDataSource[]>(() => this.dataSource());
    protected formControlInterne = signal<FormControl>(new FormControl());

    protected get control(): FormControl 
    {
        return this.ngControl?.control as FormControl;
    }

    // @Self() garantit qu'on récupère l'instance de NgControl de notre propre élément.
    constructor(@Self() private ngControl: NgControl) 
    {
        // On lie l'implémentation du ControlValueAccessor de notre composant
        // à la directive NgControl d'Angular.
        this.ngControl.valueAccessor = this;
    }

    protected AffichageMatOption(_option: AutocompleteDataSource): string 
    {
        return _option && _option.display ? _option.display : "";
    }

    ngOnInit(): void 
    {
        this.formControlInterne().setValue(this.control.value);

        if(this.control.hasValidator(Validators.required))
            this.formControlInterne().setValidators(Validators.required);

        if(this.dataSource().length > 0 && this.control.value)
        {
            const OPTION = this.dataSource().find(x => x.value == this.control.value);
            this.formControlInterne().setValue(OPTION);

            if(!this.disabledFilterComplete())
            {
                const LISTE = this.dataSource().filter(x => x.value == OPTION.value);
                this.dataSourceClone.set(LISTE);
            }
        }
    }

    protected AutoCompleteOuvert(): void
    {   
        if(!this.control.value && !this.disabledFilterComplete())
        {
            this.dataSourceClone.set(this.dataSource())
            this.formControlInterne().setValue(null);
        }

        this.opened.emit();
    }

    protected Filtrer(_event: Event): void
    {
        let valeur = (_event.target as any).value;

        this.control.setValue(this.requireSelection() ? null : valeur);
        
        this.autocompleteChange.emit(valeur);

        if(!this.disabledFilterComplete())
        {
            const VALEUR = valeur.toLowerCase();
            const LISTE = this.dataSource().filter(x => x.display.toLowerCase().includes(VALEUR));
            this.dataSourceClone.set(LISTE);
        }
    }

    protected OptionChoisi(_event: MatAutocompleteSelectedEvent): void
    {
        this.control.setValue(_event.option.value.value);
        
        if(!this.disabledFilterComplete())
        {
            const LISTE = this.dataSource().filter(x => x.display == _event.option.value.display);
            this.dataSourceClone.set(LISTE);
        }
    }

    // Pas utiliser, sert a rendre compatible pour le constructor
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    setDisabledState(isDisabled: boolean): void {}
    writeValue(obj: any): void {}
}

// {
//   "glob": "**/*",
//   "input": "node_modules/@jetonpeche/angular-mat-input/src/assets",
//   "output": "/assets/"
// },