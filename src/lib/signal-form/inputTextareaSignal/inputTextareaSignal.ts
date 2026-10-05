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
/**
     * Target signal form field tree representing the state and validation metadata.
     */
    readonly field = input.required<FieldTree<string>>();

    /**
     * Floating label text displayed above the textarea.
     */
    label = input<string>();

    /**
     * Supplementary descriptive text displayed below the textarea.
     */
    hint = input<string>();

    /**
     * Placeholder text displayed when the textarea is empty.
     * @default ''
     */
    placeholder = input<string>('');

    /**
     * Number of visible text lines for the textarea.
     * Transformed automatically from a string or number input.
     * @default null
     */
    rows = input<number | null, unknown>(null, { transform: numberAttribute });

    /**
     * Visible width of the text control in average character widths.
     * Transformed automatically from a string or number input.
     * @default null
     */
    cols = input<number | null, unknown>(null, { transform: numberAttribute });

    /**
     * Floating label behavior forwarded to MatFormField.
     * @default 'always'
     */
    floatLabel = input("auto" as FloatLabelType, { transform: () => "always" as FloatLabelType });

    /**
     * Whether to display the character counter hint when a maximum length is defined.
     * @default false
     */
    showMaxLength = input(false, { transform: booleanAttribute });

    /**
     * Whether to hide the required asterisk marker on the label.
     * @default false
     */
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