import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonAppearance, MatAnchor, MatMiniFabButton, MatFabButton, MatIconButton } from "@angular/material/button";
import { FieldTree } from '@angular/forms/signals';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'jp-signal-input-file-btn',
    standalone: true,
    templateUrl: './inputFileSignal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconModule, MatTooltipModule, MatAnchor, MatMiniFabButton, MatFabButton, MatIconButton]
})
export class InputFileSignal
{
/**
     * Target signal form field tree representing the state and validation metadata.
     */
    readonly field = input<FieldTree<FileList | File | null>>();

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
     * Whether multiple files can be selected simultaneously.
     * @default false
     */
    multiple = input<boolean>(false, { transform: booleanAttribute });

    /**
     * Disable ripple effect
     */
    disableRipple = input<boolean>(false, { transform: booleanAttribute });

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

    /**
     * Whether the button is interactively disabled.
     * @default false
     */
    disabled = input<boolean>(false, { transform: booleanAttribute });

    // État désactivé combiné avec le champ de formulaire
    protected isDisabled = computed(() =>
    {
        if (this.disabled())
            return true;

        const etat = this.field()?.() as any;
        return typeof etat?.disabled === 'function' ? Boolean(etat.disabled()) : false;
    });

    protected Ouvrir(event: MouseEvent, inputFile: HTMLInputElement): void
    {
        event.stopPropagation();
        inputFile.click();
    }

    protected InputChange(event: Event): void 
    {
        const inputElement = event.target as HTMLInputElement;
        const files = inputElement.files;

        if (!files || files.length === 0)
        {
            return;
        }

        const payload = this.multiple() ? files : files[0];

        // Mise à jour de la valeur dans le signal form s'il est fourni
        const fieldSig = this.field();
        if (fieldSig)
        {
            const fieldState = fieldSig() as any;
            if (typeof fieldState.value?.set === 'function')
            {
                fieldState.value.set(payload);
            }
        }

        this.fileChange.emit(payload);
        inputElement.value = '';
    }
}