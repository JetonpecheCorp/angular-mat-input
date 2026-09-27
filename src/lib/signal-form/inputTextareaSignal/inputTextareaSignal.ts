import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, numberAttribute } from '@angular/core';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TraductionPipe } from '../../traductionPipe';
import { FieldTree, ValidationError, FormField } from '@angular/forms/signals';

@Component({
  selector: 'jp-signal-textarea',
  standalone: true,
  templateUrl: './inputTextareaSignal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TraductionPipe, MatFormFieldModule, MatInputModule, MatIconModule, FormField]
})
export class InputTextareaSignal
{
    readonly field = input.required<FieldTree<string>>();

    label = input<string>();
    hint = input<string>();
    placeholder = input<string>('');
    rows = input<number | null>(null, { transform: numberAttribute });
    cols = input<number | null>(null, { transform: numberAttribute });

    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });
    showMaxLength = input(false, { transform: booleanAttribute });
    hiddenRequiredMarker = input(false, { transform: booleanAttribute });

    /** Valeur textuelle courante pour le compteur */
    protected valeurLongueur = computed(() => (this.field()().value() ?? '').length);

    protected listeErreur = computed(() =>
    {
        let liste = this.field()().errors() ?? [];
        const map: Record<string, ValidationError.WithFieldTree> = {};
        for (const element of liste)
            map[element.kind] = element;

        return map;
    });

    protected longeurMax = computed<number | null>(() => 
    {
        const etat = this.field()() as any;
        return typeof etat?.maxLength == 'function' ? etat.maxLength() : null;
    });

    protected longeurMin = computed<number | null>(() => 
    {
        const etat = this.field()() as any;
        return typeof etat?.minLength == 'function' ? etat.minLength() : null;
    });
}