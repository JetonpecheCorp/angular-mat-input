import { booleanAttribute, Component, input, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonAppearance, MatAnchor, MatMiniFabButton, MatFabButton, MatIconButton } from "@angular/material/button";

@Component({
  selector: 'jp-input-file-btn',
  standalone: true,
  templateUrl: './inputFile.html',
  imports: [ReactiveFormsModule, MatIconModule, MatAnchor, MatMiniFabButton, MatFabButton, MatIconButton]
})
export class InputFile implements ControlValueAccessor
{
    label = input<string>();
    icon = input<string>();
    accept = input<string>();
    matButton = input<MatButtonAppearance>("filled");

    multiple = input(false, { transform: booleanAttribute });
    matMiniFab = input(false, { transform: booleanAttribute });
    matFab = input(false, { transform: booleanAttribute });
    matIconButton = input(false, { transform: booleanAttribute });
    extended = input(false, { transform: booleanAttribute });
    
    protected disabled = signal<boolean>(false);
    
    private onChange = (_valeur: FileList) => {};
    private onTouched = () => {};

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

    protected Ouvrir(_event: Event, _inputFile: HTMLElement)
    {
        _event.stopPropagation();
        _inputFile.click();
    }

    protected InputChange(_event: Event): void
    {
        const LISTE = (_event.target as any).files;
        
        this.onChange(LISTE);
        this.onTouched();
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
        this.disabled.set(isDisabled);   
    }

    writeValue(obj: any): void {}
}