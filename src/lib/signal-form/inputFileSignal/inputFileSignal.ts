import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonAppearance, MatAnchor, MatMiniFabButton, MatFabButton, MatIconButton } from "@angular/material/button";
import { FieldTree } from '@angular/forms/signals';

@Component({
    selector: 'jp-signal-input-file-btn',
    standalone: true,
    templateUrl: './inputFileSignal.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconModule, MatAnchor, MatMiniFabButton, MatFabButton, MatIconButton]
})
export class InputFileSignal
{
    readonly field = input<FieldTree<FileList | File | null>>();

    fileChange = output<FileList | File>();

    label = input<string>('');
    icon = input<string>();
    accept = input<string>();
    matButton = input<MatButtonAppearance>('filled');

    multiple = input<boolean>(false, { transform: booleanAttribute });
    matMiniFab = input<boolean>(false, { transform: booleanAttribute });
    matFab = input<boolean>(false, { transform: booleanAttribute });
    matIconButton = input<boolean>(false, { transform: booleanAttribute });
    extended = input<boolean>(false, { transform: booleanAttribute });
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