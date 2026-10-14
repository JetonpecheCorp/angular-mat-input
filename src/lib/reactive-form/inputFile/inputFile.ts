import { booleanAttribute, ChangeDetectionStrategy, Component, input, Optional, output, Self, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonAppearance, MatAnchor, MatMiniFabButton, MatFabButton, MatIconButton } from "@angular/material/button";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'jp-input-file-btn',
  standalone: true,
  templateUrl: './inputFile.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatTooltipModule, MatIconModule, MatAnchor, MatMiniFabButton, MatFabButton, MatIconButton]
})
export class InputFile implements ControlValueAccessor
{
    /**
     * Emits the selected file or file list when the native file selection changes.
     */
    fileChange = output<FileList | File>();

    /**
     * Button text label displayed next to or below the icon.
     * @default ''
     */
    label = input<string>('');

    /**
     * Material icon name displayed within the button.
     */
    icon = input<string>();

    /**
     * Comma-separated list of allowed file extensions or MIME types (e.g., 'image/*', '.pdf').
     */
    accept = input<string>();

    /**
     * Tooltip message text displayed on hover or focus.
     */
    matTooltip = input<string>();

    /**
     * Visual style variant applied to standard Angular Material buttons.
     * @default 'filled'
     */
    matButton = input<MatButtonAppearance>('filled');

    /**
     * Disable ripple effect
     */
    disableRipple = input<boolean>(false, { transform: booleanAttribute });

    /**
     * Whether multiple files can be selected simultaneously.
     * @default false
     */
    multiple = input<boolean>(false, { transform: booleanAttribute });

    /**
     * Renders the button as a mini floating action button (Mini FAB).
     * @default false
     */
    matMiniFab = input<boolean>(false, { transform: booleanAttribute });

    /**
     * Renders the button as a standard floating action button (FAB).
     * @default false
     */
    matFab = input<boolean>(false, { transform: booleanAttribute });

    /**
     * Renders the button as a compact icon-only button.
     * @default false
     */
    matIconButton = input<boolean>(false, { transform: booleanAttribute });

    /**
     * Expands the FAB layout to include both an icon and a text label.
     * Only applies when `matFab` is true.
     * @default false
     */
    extended = input<boolean>(false, { transform: booleanAttribute });
    
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