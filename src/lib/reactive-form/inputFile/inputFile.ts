import { booleanAttribute, Component, input, Optional, output, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
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
    fileChange = output<FileList | File>();

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
    
    private onChange = (_valeur: FileList | File) => {};
    private onTouched = () => {};

    // @Self() garantit qu'on récupère l'instance de NgControl de notre propre élément.
    constructor(@Optional() @Self() private ngControl: NgControl) 
    {
        if(ngControl)
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

        if(!LISTE || LISTE.length == 0)
            return;
        
        if(this.multiple())
        {
            this.onChange(LISTE);
            this.fileChange.emit(LISTE);
        }
        else
        {
            this.onChange(LISTE[0]);
            this.fileChange.emit(LISTE[0]);
        }

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