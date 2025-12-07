import { booleanAttribute, Component, input, OnInit, output, signal, Self, model, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
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

    protected dataSourceClone = signal<AutocompleteDataSource[]>([]);
    protected formControlInterne = new FormControl();

    private onChange = (value: any) => {};
    private onTouched = () => {};

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
        console.log(changes);
        console.log(this.formControlInterne);
        
        

        if(changes["dataSource"])
        {
            this.dataSourceClone.set(changes["dataSource"].currentValue);

            if(this.ngControl.control?.value && !changes["dataSource"].firstChange)
            {   
                let info = this.dataSource().find(x => x.value == this.ngControl.control?.value)
                this.formControlInterne.setValue(info);
            }
        }
    }

    protected AffichageMatOption(_option: AutocompleteDataSource): string 
    {
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
        this.onChange(selectedOption.value);
    }

    protected Blur(): void 
    {
        this.onTouched();
    }

    writeValue(value: any): void 
    {
        const OPTION = this.dataSource().find(x => x.value == value);
        this.formControlInterne.setValue(OPTION, { emitEvent: false });
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
